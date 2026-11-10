const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Exercise the production reader with deterministic API snapshots and cache time.
// No Calendar writes, credentials, network requests or test-only application flags.
function calendarHarness() {
  let clock = 0;
  let requests = [];
  let api = async () => ({ data: { items: [] } });
  const cache = new Map();
  const load = relative => {
    const filename = path.join(__dirname, '..', relative);
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    const m = new Module(filename, module);
    m.filename = filename;
    m.paths = Module._nodeModulePaths(path.dirname(filename));
    const original = m.require.bind(m);
    m.require = name => {
      if (name === 'server-only') return {};
      if (name.startsWith('@/')) return load(`${name.slice(2)}.ts`);
      if (name === 'googleapis') return { google: {
        auth: { GoogleAuth: class {} },
        calendar: () => ({ events: { list: async query => { requests.push(query); return api(query); } } }),
      } };
      if (name === 'next/cache') return { unstable_cache: (fn, keys, options) => async (...args) => {
        assert.equal(options.revalidate, 300);
        const key = JSON.stringify([keys, args]);
        const entry = cache.get(key);
        if (entry && clock - entry.time < options.revalidate) return entry.value;
        const value = await fn(...args);
        cache.set(key, { value, time: clock });
        return value;
      } };
      return original(name);
    };
    m._compile(compiled, filename);
    return m.exports;
  };
  process.env.GOOGLE_CALENDAR_ID = 'test-calendar';
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test-account';
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = 'test-key';
  return { reader: load('lib/calendar.ts'), setApi: handler => { api = handler; }, advance: seconds => { clock += seconds; }, requests: () => requests };
}
const timed = (id, changes = {}) => ({ id, summary: 'Hatha–Vinyasa Yoga', start: { dateTime: '2026-11-14T10:00:00+01:00' }, end: { dateTime: '2026-11-14T11:00:00+01:00' }, ...changes });

test('normalization preserves full practical text, native fields and safe plain text', () => {
  const { reader } = calendarHarness();
  const description = 'Bring a mat.\n\n' + 'Practical information. '.repeat(40).trimEnd() + '\nMeet by the door.';
  const event = reader.normalizeEvent(timed('long', { description, location: '  Cologne  ' }), 0);
  assert.equal(event.description, description);
  assert.equal(event.location, 'Cologne');
  assert.equal(event.dateKey, '2026-11-14');
  assert.equal(event.timeLabel, '10:00–11:00');
  assert.equal(event.offeringId, 'hatha-vinyasa');
  assert.equal(reader.calendarDescriptionText('<p>Bring a mat &amp; water.</p><p>Arrive early.<br>Thank you.</p><script>alert(1)</script><img src=x onerror=alert(1)>'), 'Bring a mat & water.\n\nArrive early.\nThank you.');
  assert.equal(reader.calendarDescriptionText('Saturday, 14 November\n10:00–11:00\nPlease arrive 10 minutes before class.'), 'Saturday, 14 November\n10:00–11:00\nPlease arrive 10 minutes before class.');
  assert.equal(reader.normalizeEvent(timed('none'), 0).description, undefined);
  assert.equal(reader.normalizeEvent(timed('none'), 0).location, undefined);
  assert.equal(reader.normalizeEvent(timed('cancelled', { status: 'cancelled' }), 0), null);
  assert.equal(reader.normalizeEvent({ id:'invalid',start:{dateTime:'bad'} }, 0), null);
});

test('all-day, missing end and DST-aware native start dates', () => {
  const { reader } = calendarHarness();
  const allDay = reader.normalizeEvent({ id:'all-day', summary:'Workshop', start:{date:'2026-11-14'},end:{date:'2026-11-15'} }, 0);
  assert.equal(allDay.dateKey,'2026-11-14'); assert.equal(allDay.timeLabel,'All day'); assert.equal(allDay.allDay,true);
  assert.equal(reader.normalizeEvent(timed('start-only',{end:undefined}),0).timeLabel,'10:00');
  assert.equal(reader.normalizeEvent(timed('midnight',{start:{dateTime:'2026-10-31T23:30:00Z'}}),0).dateKey,'2026-11-01');
  assert.deepEqual(reader.getCalendarFetchWindow(new Date('2026-11-09T12:00:00Z')), {timeMin:'2026-09-30T22:00:00.000Z',timeMax:'2027-05-31T22:00:00.000Z'});
  assert.deepEqual(reader.getCalendarFetchWindow(new Date('2026-12-31T23:30:00Z')), {timeMin:'2026-11-30T23:00:00.000Z',timeMax:'2027-07-31T22:00:00.000Z'});
});

test('pagination includes newly created events after result 250 and expanded recurrence', async () => {
  const h = calendarHarness();
  h.setApi(async query => ({ data: query.pageToken ? {items:[timed('newly-created'),timed('series_instance',{recurringEventId:'series'})]} : {items:Array.from({length:250},(_,i)=>timed(`older-${i}`)),nextPageToken:'page-2'} }));
  const result = await h.reader.getUpcomingCalendarEvents();
  assert.equal(result.events.length,252);
  assert.ok(result.events.some(e=>e.id==='newly-created'));
  assert.ok(result.events.some(e=>e.id==='series_instance'));
  assert.equal(h.requests().length,2);
  for (const query of h.requests()) { assert.equal(query.singleEvents,true);assert.equal(query.orderBy,'startTime');assert.equal(query.showDeleted,false);assert.equal(query.timeZone,'Europe/Berlin'); }
  assert.equal(result.fetchedEventCount,252); assert.ok(result.lastSuccessfulFetchAt);
});

test('same five-minute cache policy applies to edits, creates, deletes and recurring instances', async () => {
  const h = calendarHarness();
  let items = [timed('existing')];
  h.setApi(async()=>({data:{items}}));
  await h.reader.getUpcomingCalendarEvents();
  items = [timed('existing',{summary:'Updated class',description:'Updated details',location:'New venue',start:{dateTime:'2026-11-14T12:00:00+01:00'},end:{dateTime:'2026-11-14T13:00:00+01:00'}})];
  h.advance(299);
  assert.equal((await h.reader.getUpcomingCalendarEvents()).events[0].title,'Hatha–Vinyasa Yoga');
  h.advance(1);
  const edited = (await h.reader.getUpcomingCalendarEvents()).events[0];
  assert.equal(edited.title,'Updated class');assert.equal(edited.description,'Updated details');assert.equal(edited.location,'New venue');assert.equal(edited.timeLabel,'12:00–13:00');
  items.push(timed('created'));
  h.advance(300);assert.equal((await h.reader.getUpcomingCalendarEvents()).events.length,2);
  items = [timed('existing',{status:'cancelled'}),timed('created'),timed('repeat_instance_1'),timed('repeat_instance_2')];
  h.advance(300);
  const cancelled = await h.reader.getUpcomingCalendarEvents();
  assert.ok(!cancelled.events.some(e=>e.id==='existing'));assert.equal(cancelled.events.length,3);
  items = items.filter(e=>e.id!=='created');h.advance(300);
  assert.equal((await h.reader.getUpcomingCalendarEvents()).events.length,2);
  assert.equal(h.requests().length,5);
  process.env.GOOGLE_CALENDAR_ID='another-calendar';
  await h.reader.getUpcomingCalendarEvents();assert.equal(h.requests().length,6);
});

test('failures expose safe status and retain the last successful fetch timestamp', async () => {
  const h = calendarHarness();
  await h.reader.getUpcomingCalendarEvents();
  h.setApi(async()=>{throw new Error('private response credentials and event contents');});h.advance(300);
  const failed = await h.reader.getUpcomingCalendarEvents();
  assert.equal(failed.requestSucceeded,false);assert.ok(failed.lastSuccessfulFetchAt);
  assert.equal(h.reader.getCalendarFetchDiagnostics().succeeded,false);
  assert.ok(!JSON.stringify(failed).includes('private response'));
});
