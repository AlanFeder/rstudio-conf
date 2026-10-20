import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const roots = [
  '2017/Database_Best_Practices-Jim_Hester/2017_01_13-RStudio_conf-Database_Best_Practices_files/reveal.js-3.3.0',
  '2018/RStudio_Pro_1.1_Features--Jonathan_McPherson/rsp11-features_files/reveal.js-3.3.0.1',
];
for (const root of roots) {
  test(`${root}: cross-origin API messages cannot control slides`, () => {
    const source = readFileSync(join(root, 'js/reveal.js'), 'utf8');
    const start = source.indexOf('function setupPostMessage()');
    const end = source.indexOf('function configure(', start);
    const setup = source.slice(start, end);
    let listener;
    const calls = [];
    const window = { location: { origin: 'https://slides.example' },
      addEventListener: (_, callback) => { listener = callback; } };
    const Reveal = { slide: (...args) => calls.push(args) };
    new Function('window', 'config', 'Reveal', setup + ';setupPostMessage();')(window, { postMessage: true }, Reveal);
    const data = JSON.stringify({ method: 'slide', args: [2] });
    listener({ origin: 'https://attacker.example', data });
    listener({ origin: 'null', data });
    assert.equal(calls.length, 0);
    listener({ origin: 'https://slides.example', data });
    assert.deepEqual(calls, [[2]]);
  });
}
