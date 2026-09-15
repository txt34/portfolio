import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '..');

test('expects the local app files needed to start the server', () => {
  assert.equal(fs.existsSync(path.join(projectRoot, 'src', 'server.ts')), true, 'src/server.ts should exist');
  assert.equal(fs.existsSync(path.join(projectRoot, 'src', 'api', 'example-api.ts')), true, 'src/api/example-api.ts should exist');
  assert.equal(fs.existsSync(path.join(projectRoot, 'src', 'utils', 'logger.ts')), true, 'src/utils/logger.ts should exist');
});
