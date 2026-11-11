const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function harness(language = 'en') {
  const cache = new Map();
  function load(relative) {
    const filename = path.join(__dirname, '..', relative);
    if (cache.has(filename)) return cache.get(filename);
    const m = new Module(filename, module);
    m.filename = filename;
    m.paths = Module._nodeModulePaths(path.dirname(filename));
    const original = m.require.bind(m);
    m.require = name => {
      if (name.endsWith('/LanguageProvider') || name === './LanguageProvider') return { useSiteLanguage: () => ({ language, t: load('lib/i18n/translations.ts').getTranslations(language) }) };
      if (name.startsWith('@/') || name.startsWith('./')) {
        const base = name.startsWith('@/') ? name.slice(2) : path.relative(path.join(__dirname, '..'), path.resolve(path.dirname(filename), name));
        const suffix = fs.existsSync(path.join(__dirname, '..', `${base}.ts`)) ? '.ts' : '.tsx';
        return load(base + suffix);
      }
      return original(name);
    };
    const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    m._compile(source, filename);
    cache.set(filename, m.exports);
    return m.exports;
  }
  return load;
}

function shape(value) {
  if (typeof value === 'string') return 'string';
  if (Array.isArray(value)) return value.map(shape);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
}

test('local dictionaries have complete matching keys and preserve English source data', () => {
  const load = harness();
  const { translations, dateLocale } = load('lib/i18n/translations.ts');
  const { siteContent } = load('content/siteContent.ts');
  assert.deepEqual(shape(translations.de), shape(translations.en));
  for (const key of ['labels', 'offerings', 'principles']) assert.deepEqual(translations.en[key], siteContent[key]);
  assert.equal(dateLocale('de'), 'de-DE');
  assert.equal(dateLocale('en'), 'en-GB');
  for (const [index, principle] of siteContent.principles.entries()) {
    assert.equal(translations.de.principles[index].tamil, principle.tamil);
  }
});

test('each language has its own canonical, shared hreflang links, and localized metadata', () => {
  const { localizedMetadata } = harness()('lib/i18n/metadata.ts');
  const en = localizedMetadata('en'), de = localizedMetadata('de');
  assert.equal(en.alternates.canonical, '/');
  assert.equal(de.alternates.canonical, '/de');
  assert.deepEqual(de.alternates.languages, { en: '/', de: '/de', 'x-default': '/' });
  assert.equal(en.title, 'theagamyoga | Hatha Yoga in Cologne');
  assert.notEqual(de.title, en.title);
  assert.equal(de.openGraph.locale, 'de_DE');
});

test('German Calendar presentation localizes dates and controls but preserves native event text', () => {
  const load = harness('de');
  const { CalendarEventDetail } = load('components/CalendarEventDetail.tsx');
  const event = { id: 'native', title: 'Original English class title', description: 'Original supplied description. No translation.', location: 'Original supplied location', dateKey: '2026-11-14', start: '2026-11-14T09:00:00Z', timeLabel: '10:00–11:00', allDay: false };
  const markup = renderToStaticMarkup(React.createElement(CalendarEventDetail, { event, onEnquire() {} }));
  for (const value of [event.title, event.description, event.location, event.timeLabel]) assert.ok(markup.includes(value));
  assert.ok(markup.includes('Samstag, 14. November'));
  assert.ok(markup.includes(load('lib/i18n/translations.ts').getTranslations('de').calendar.enquire));
});

test('month overview limits agenda previews to two rows, summarizes extras and completes every week', () => {
  for (const language of ['en', 'de']) {
    const load = harness(language);
    const { MonthCalendar } = load('components/MonthCalendar.tsx');
    const events = [1, 2, 5, 10].flatMap((count, index) => Array.from({ length: count }, (_, item) => ({ id: `${index}-${item}`, dateKey: `2026-11-${String(index + 1).padStart(2, '0')}`, title: `Native event ${index}-${item}`, timeLabel: '10:00–11:00', allDay: false, startTimestamp: item })));
    const markup = renderToStaticMarkup(React.createElement(MonthCalendar, { events, initialMonthKey: '2026-11', calendarTimeZone: 'Europe/Berlin' }));
    assert.ok(markup.includes('10:00 Native event 0-0'));
    assert.ok(!markup.includes('10:00–11:00'));
    assert.equal((markup.match(/class="month-calendar__preview"/g) || []).length, 7);
    assert.ok(!markup.includes('Native event 2-2'));
    assert.ok(!markup.includes('Native event 3-9'));
    assert.ok(markup.includes(`+3 ${language === 'de' ? 'weitere' : 'more'}`));
    assert.ok(markup.includes(`+8 ${language === 'de' ? 'weitere' : 'more'}`));
    assert.match(markup, /aria-label="1\.? November 2026, 1 (class|Kurs)"/);
    for (const [day, count] of [[2, 2], [3, 5], [4, 10]]) {
      assert.ok(markup.includes(`aria-label="${day}${language === 'de' ? '.' : ''} November 2026, ${count} ${language === 'de' ? 'Kurse' : 'classes'}"`));
    }
    assert.match(markup, /aria-label="5\.? November 2026, (no classes|keine Kurse)"/);
    assert.equal((markup.match(/role="gridcell"/g) || []).length, 42);
    assert.equal((markup.match(/class="month-calendar__day month-calendar__day--empty"/g) || []).length, 12);
  }
});

test('month padding handles first/last week and today is programmatically identified', () => {
  const { MonthCalendar } = harness()('components/MonthCalendar.tsx');
  for (const [month, slots, blanks] of [['2027-02', 28, 0], ['2026-05', 35, 4], ['2026-11', 42, 12]]) {
    const markup = renderToStaticMarkup(React.createElement(MonthCalendar, { events: [], initialMonthKey: month, calendarTimeZone: 'Europe/Berlin' }));
    assert.equal((markup.match(/role="gridcell"/g) || []).length, slots);
    assert.equal((markup.match(/class="month-calendar__day month-calendar__day--empty"/g) || []).length, blanks);
  }
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit' }).formatToParts(new Date());
  const currentMonth = `${parts.find(part => part.type === 'year').value}-${parts.find(part => part.type === 'month').value}`;
  const markup = renderToStaticMarkup(React.createElement(MonthCalendar, { events: [], initialMonthKey: currentMonth, calendarTimeZone: 'Europe/Berlin' }));
  assert.equal((markup.match(/aria-current="date"/g) || []).length, 1);
});


test('agenda previews put all-day events before timed events in chronological order', () => {
  const { MonthCalendar } = harness()('components/MonthCalendar.tsx');
  const common = { dateKey: '2026-11-13' };
  const events = [
    { ...common, id: 'late', title: 'Later class', allDay: false, startTimestamp: 18, timeLabel: '18:00–19:00' },
    { ...common, id: 'all-day', title: 'Day Off', allDay: true, startTimestamp: 0, timeLabel: 'All day' },
    { ...common, id: 'early', title: 'Morning class', allDay: false, startTimestamp: 8, timeLabel: '08:00–09:00' },
  ];
  const markup = renderToStaticMarkup(React.createElement(MonthCalendar, { events, initialMonthKey: '2026-11', calendarTimeZone: 'Europe/Berlin' }));
  assert.ok(markup.includes('<span>Day Off</span>'));
  assert.ok(!markup.includes('All day Day Off'));
  assert.ok(markup.includes('08:00 Morning class'));
  assert.ok(markup.indexOf('Day Off') < markup.indexOf('08:00 Morning class'));
  assert.ok(!markup.includes('Later class'));
  assert.ok(markup.includes('+1 more'));
  assert.equal(events[0].id, 'late', 'sorting must not mutate the supplied event array');
  assert.ok(markup.indexOf('calendar-timezone') > markup.indexOf('month-calendar__grid'));
});

test('gallery image URLs preserve escaped filenames for the production optimizer', () => {
  const load = harness();
  const { Gallery } = load('components/Gallery.tsx');
  const { siteContent } = load('content/siteContent.ts');
  const markup = renderToStaticMarkup(React.createElement(Gallery));
  for (const image of siteContent.galleryImages) {
    assert.ok(markup.includes(`url=${encodeURIComponent(image.src.split("/").map(encodeURIComponent).join("/"))}`), `optimizer must receive an escaped path for ${image.src}`);
  }
});
