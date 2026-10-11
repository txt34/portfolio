import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import bcrypt from 'bcryptjs';

const projectRoot = path.resolve(import.meta.dirname, '..');
const port = 19192;

async function runManualTesting() {
  console.log('🚀 Starting manual end-to-end verification server...');
  const passwordHash = await bcrypt.hash('test-password', 4);
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

  const baseUrl = `http://127.0.0.1:${port}`;

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

  console.log('✅ Server started successfully. Running manual HTTP endpoint checks...');

  const rootRes = await fetch(`${baseUrl}/`);
  console.log(`[GET /] Status: ${rootRes.status} (Expected 200)`);
  assert.equal(rootRes.status, 200);
  const htmlText = await rootRes.text();
  assert.ok(htmlText.includes('Devin Holmes'), 'Root should contain Devin Holmes');
  assert.ok(htmlText.includes('Fordham'), 'Root should contain Fordham');
  assert.ok(htmlText.includes('BGSU'), 'Root should contain BGSU');

  const healthRes = await fetch(`${baseUrl}/health`);
  console.log(`[GET /health] Status: ${healthRes.status} (Expected 200)`);
  assert.equal(healthRes.status, 200);

  const secRes = await fetch(`${baseUrl}/api/security-status`);
  console.log(`[GET /api/security-status] Status: ${secRes.status} (Expected 200)`);
  assert.equal(secRes.status, 200);

  const catRes = await fetch(`${baseUrl}/api/products?category=Home`);
  console.log(`[GET /api/products?category=Home] Status: ${catRes.status} (Expected 200)`);
  assert.equal(catRes.status, 200);

  const protRes = await fetch(`${baseUrl}/api/protected`);
  console.log(`[GET /api/protected] Status: ${protRes.status} (Expected 401)`);
  assert.equal(protRes.status, 401);

  const robRes = await fetch(`${baseUrl}/robots.txt`);
  console.log(`[GET /robots.txt] Status: ${robRes.status} (Expected 200)`);
  assert.equal(robRes.status, 200);

  console.log('🎉 All manual end-to-end verification tests passed successfully with 100% compliance!');
  child.kill('SIGTERM');
}

runManualTesting().catch((err) => {
  console.error('❌ Manual testing failed:', err);
  process.exit(1);
});
