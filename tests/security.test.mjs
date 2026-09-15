import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import test from 'node:test';
import bcrypt from 'bcryptjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const port = 18180;

const startServer = async () => {
  const passwordHash = await bcrypt.hash('portfolio-test-password', 4);
  const child = spawn(process.execPath, [
    path.join(projectRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs'),
    path.join(projectRoot, 'src', 'server.ts')
  ], {
    cwd: projectRoot,
    env: {
      ...process.env,
      CODESPACES: 'true',
      NODE_ENV: 'test',
      PORT: String(port),
      SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
      USER_PASSWORD_HASH: passwordHash
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await new Promise((resolve, reject) => {
    let output = '';
    const onData = (chunk) => {
      output += chunk.toString();
      if (output.includes(`"port":${port}`)) {
        child.stdout.off('data', onData);
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
    });
    child.once('exit', (code) => reject(new Error(`server exited with ${code}: ${output}`)));
    setTimeout(() => reject(new Error(`server did not start: ${output}`)), 10000).unref();
  });

  return child;
};

test('production security boundaries hold at the HTTP API', async (t) => {
  const server = await startServer();
  t.after(() => server.kill('SIGTERM'));

  const root = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(root.status, 200);
  assert.match(root.headers.get('x-request-id') ?? '', /^[0-9a-f-]{36}$/);

  const health = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(health.status, 200);
  assert.deepEqual((await health.json()).status, 'ok');

  const statusPolls = await Promise.all(Array.from({ length: 55 }, () => Promise.all([
    fetch(`http://127.0.0.1:${port}/healthz`),
    fetch(`http://127.0.0.1:${port}/api/security-status`)
  ])));
  assert.equal(statusPolls.flat().every((response) => response.status === 200), true);

  const catalog = await fetch(`http://127.0.0.1:${port}/api/products?category=Home`);
  assert.equal(catalog.status, 200);
  assert.match(catalog.headers.get('x-robots-tag') ?? '', /noindex/);
  assert.ok((await catalog.json()).products.length > 0);

  const robots = await fetch(`http://127.0.0.1:${port}/robots.txt`);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Disallow: \/api\//);

  const invalidCatalog = await fetch(`http://127.0.0.1:${port}/api/products?category=Unknown`);
  assert.equal(invalidCatalog.status, 400);

  const invalidProduct = await fetch(`http://127.0.0.1:${port}/api/products/not%20an%20id`);
  assert.equal(invalidProduct.status, 400);

  const productPage = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(productPage.status, 200);
  assert.match(await productPage.text(), /Common Ground/);
  const contentSecurityPolicy = productPage.headers.get('content-security-policy') ?? '';
  assert.match(contentSecurityPolicy, /img-src[^;]*'self'/);
  assert.doesNotMatch(contentSecurityPolicy, /style-src[^;]*unsafe-inline/);

  const metrics = await fetch(`http://127.0.0.1:${port}/metrics`);
  assert.equal(metrics.status, 404);

  const protectedResponse = await fetch(`http://127.0.0.1:${port}/api/protected`);
  assert.equal(protectedResponse.status, 401);

  const diagnostics = await fetch(`http://127.0.0.1:${port}/api/diagnostics`);
  assert.equal(diagnostics.status, 401);

  const diagnosticsFeed = await fetch(`http://127.0.0.1:${port}/api/diagnostics/feed`);
  assert.equal(diagnosticsFeed.status, 401);

  const invalidExample = await fetch(`http://127.0.0.1:${port}/api/example?name=${'x'.repeat(101)}`);
  assert.equal(invalidExample.status, 400);

  const untrustedPipe = await fetch(`http://127.0.0.1:${port}/api/data-pipe`, { method: 'POST', body: 'data' });
  assert.equal(untrustedPipe.status, 403);
});
