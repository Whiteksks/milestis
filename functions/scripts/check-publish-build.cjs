// Exercise Node's actual CommonJS resolution, not just TypeScript source imports.
// No Firebase calls: validation and slug helpers are pure.
/* global require, console */
/* eslint-disable @typescript-eslint/no-require-imports -- Match the deployed CommonJS runtime. */
const assert = require('node:assert/strict');
const { validateMenuPublishInput } = require('../lib/projects/menu/publish.js');
const { getSlugReservationDocId, normalizeSlug } = require('../lib/projects/publish/slug/index.js');

assert.deepEqual(validateMenuPublishInput({ projectId: 'build-check', slug: ' My-Cafe ', locale: 'ru' }), {
  projectId: 'build-check', slug: 'my-cafe', locale: 'ru',
});
assert.equal(normalizeSlug(' My-Cafe '), 'my-cafe');
assert.equal(getSlugReservationDocId('menu', 'my-cafe'), 'my-cafe');
assert.throws(() => validateMenuPublishInput({ projectId: 'build-check', slug: 'ab', locale: 'ru' }),
  (error) => error.code === 'INVALID_SLUG');
console.log('Compiled publication modules: OK');
