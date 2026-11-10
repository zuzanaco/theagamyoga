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
