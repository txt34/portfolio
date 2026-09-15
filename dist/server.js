import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import { query, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import logger from './utils/logger.js';
import client from 'prom-client';
import { exampleApiHandler } from './api/example-api.js';
import { products } from './catalog/products.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT ?? 8080);
const HTTPS_PORT = Number(process.env.HTTPS_PORT ?? 3443);
const isCodespaces = process.env.CODESPACES === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const publicOrigin = process.env.PUBLIC_ORIGIN ?? (isCodespaces ? `https://localhost:${PORT}` : `https://localhost:${HTTPS_PORT}`);
const maxRequestBytes = Number(process.env.MAX_REQUEST_BYTES ?? 100_000);
const dataDirectory = path.resolve(process.env.DATA_DIR ?? path.join(process.cwd(), 'data'));
const sessionSecret = process.env.SESSION_SECRET;
const metricsToken = process.env.METRICS_TOKEN;
const serverStartedAt = new Date();
const diagnosticEvents = [];
const diagnosticSubscribers = new Set();
const runningServers = new Set();
let totalRequests = 0;
let failedRequests = 0;
let authenticatedRequests = 0;
let activeConnectionCount = 0;
let serverReady = false;
let shuttingDown = false;
const certificateDirectory = path.resolve(__dirname, '..', 'certificates');
const keyPath = path.join(certificateDirectory, 'key.pem');
const certificatePath = path.join(certificateDirectory, 'cert.pem');
const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS ?? 30_000);
const publishDiagnosticEvent = (event) => {
    const payload = `id: ${event.requestId}\nevent: request\ndata: ${JSON.stringify(event)}\n\n`;
    for (const subscriber of diagnosticSubscribers) {
        if (subscriber.writableEnded || subscriber.destroyed) {
            diagnosticSubscribers.delete(subscriber);
            continue;
        }
        if (!subscriber.write(payload)) {
            diagnosticSubscribers.delete(subscriber);
            subscriber.end();
        }
    }
};
if (!sessionSecret || sessionSecret.length < 32 || sessionSecret === 'change-this-for-local-development') {
    throw new Error('A strong SESSION_SECRET is required.');
}
if (metricsToken && metricsToken.length < 32) {
    throw new Error('METRICS_TOKEN must be at least 32 characters when configured.');
}
if (!isCodespaces && (!fs.existsSync(keyPath) || !fs.existsSync(certificatePath))) {
    if (isProduction)
        throw new Error('Production TLS certificate files are required.');
    logger.warn('Local HTTPS certificate not found; generating a development certificate.');
    fs.mkdirSync(certificateDirectory, { recursive: true });
    const { execSync } = await import('node:child_process');
    execSync(`openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certificatePath}" -days 365 -nodes -subj "/CN=localhost"`, { stdio: 'inherit' });
}
const listenOnPort = (server, port, label) => new Promise((resolve, reject) => {
    const onError = (error) => reject(new Error(`${label} port ${port} is unavailable: ${error.message}`));
    server.requestTimeout = requestTimeoutMs;
    server.headersTimeout = Math.min(requestTimeoutMs, 15_000);
    server.keepAliveTimeout = 5_000;
    server.once('error', onError);
    server.listen(port, '0.0.0.0', () => {
        server.removeListener('error', onError);
        runningServers.add(server);
        logger.info(`${label} server running`, { port });
        resolve();
    });
});
app.disable('x-powered-by');
app.set('query parser', 'simple');
app.set('trust proxy', isCodespaces || isProduction ? 1 : false);
app.use((req, res, next) => {
    const requestId = randomUUID();
    totalRequests += 1;
    res.set('X-Request-Id', requestId);
    res.locals.requestId = requestId;
    res.on('finish', () => {
        if (res.statusCode >= 400)
            failedRequests += 1;
        if (req.path === '/api/security-status')
            return;
        const diagnosticEvent = {
            requestId,
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            statusCode: res.statusCode
        };
        logger.info('HTTP request', diagnosticEvent);
        diagnosticEvents.push(diagnosticEvent);
        if (diagnosticEvents.length > 25)
            diagnosticEvents.shift();
        publishDiagnosticEvent(diagnosticEvent);
    });
    next();
});
app.use(express.json({ limit: maxRequestBytes }));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
            objectSrc: ["'none'"],
            scriptSrc: ["'self'", 'https://unpkg.com'],
            styleSrc: ["'self'", 'https://fonts.googleapis.com']
        }
    }
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => req.path === '/healthz'
        || req.path === '/api/security-status'
        || req.path.startsWith('/assets/'),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Try again later.' }
}));
app.use('/api', (req, res, next) => {
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    if (Object.values(req.query).some(Array.isArray))
        return res.status(400).json({ error: 'Repeated query parameters are not supported' });
    next();
});
const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });
const requestDuration = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in milliseconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [1, 5, 15, 50, 100, 250, 500, 1000, 2000]
});
const activeConnections = new client.Gauge({ name: 'active_connections', help: 'Number of active connections' });
const productCategories = [...new Set(products.map((product) => product.category))];
registry.registerMetric(requestDuration);
registry.registerMetric(activeConnections);
app.use((req, res, next) => {
    activeConnections.inc();
    activeConnectionCount += 1;
    const end = requestDuration.startTimer();
    res.on('finish', () => {
        activeConnections.dec();
        activeConnectionCount = Math.max(0, activeConnectionCount - 1);
        end({ method: req.method, route: req.path, code: res.statusCode });
    });
    next();
});
app.get('/metrics', async (req, res) => {
    if (!metricsToken || req.get('authorization') !== `Bearer ${metricsToken}`)
        return res.status(404).end();
    res.set('Cache-Control', 'no-store').type(registry.contentType).send(await registry.metrics());
});
app.get('/healthz', (_req, res) => {
    res.status(serverReady && !shuttingDown ? 200 : 503).json({
        status: serverReady && !shuttingDown ? 'ok' : 'starting',
        serverTime: new Date().toISOString()
    });
});
const securityStatusLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many status requests. Try again later.' }
});
app.get('/api/security-status', securityStatusLimiter, (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({
        serverTime: new Date().toISOString(),
        status: serverReady && !shuttingDown ? 'active' : 'starting',
        protections: {
            transport: isCodespaces || isProduction ? 'active' : 'development-only',
            securityHeaders: 'active',
            rateLimiting: 'active',
            requestValidation: 'active',
            csrfProtection: 'active',
            requestSizeLimits: 'active'
        }
    });
});
app.use(cookieParser());
app.use(session({
    name: '__Host-app.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/', secure: true, httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 1000 }
}));
app.use(csurf({ cookie: { key: '__Host-csrf', httpOnly: true, sameSite: 'strict', secure: true } }));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets'), {
    dotfiles: 'deny',
    index: false,
    maxAge: isProduction ? '7d' : 0,
    immutable: isProduction
}));
app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow: /api/\nDisallow: /metrics\n');
});
app.get('/.well-known/security.txt', (_req, res) => {
    res.type('text/plain').send('Contact: mailto:security@commonground.example\nExpires: 2027-09-15T00:00:00.000Z\nPreferred-Languages: en\n');
});
app.get('/api/csrf-token', (req, res) => {
    res.set('Cache-Control', 'no-store').json({ csrfToken: req.csrfToken() });
});
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '..', 'assets', 'index.html')));
app.get('/api/products', [
    query('search').optional().isString().trim().isLength({ max: 80 }),
    query('category').optional().isIn([...new Set(products.map((product) => product.category))]),
    query('limit').optional().isInt({ min: 1, max: 24 })
], rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Catalog request limit reached. Try again shortly.' }
}), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ error: 'Invalid catalog query' });
    const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : 24;
    const filteredProducts = products
        .filter((product) => !category || product.category === category)
        .filter((product) => !search || `${product.name} ${product.maker} ${product.category}`.toLowerCase().includes(search))
        .slice(0, limit);
    res.set('Cache-Control', isProduction
        ? 'public, max-age=60, s-maxage=300, stale-while-revalidate=60'
        : 'no-store');
    res.json({
        products: filteredProducts,
        categories: productCategories
    });
});
app.get('/api/products/:id', (req, res) => {
    if (!/^[a-z0-9-]{1,64}$/.test(req.params.id))
        return res.status(400).json({ error: 'Invalid product id' });
    const product = products.find((candidate) => candidate.id === req.params.id);
    if (!product)
        return res.status(404).json({ error: 'Product not found' });
    return res.json({ product });
});
app.get('/api/example', [query('name').optional().isString().trim().isLength({ max: 100 }).withMessage('Name must be at most 100 characters')], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ error: 'Invalid request' });
    try {
        return res.json(await exampleApiHandler(req.query));
    }
    catch (error) {
        logger.error('Example API failed', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
const users = [
    { username: process.env.USER_USERNAME ?? 'user', role: 'user', passwordHash: process.env.USER_PASSWORD_HASH }
].filter((user) => Boolean(user.passwordHash));
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts. Try again later.' }
});
const authenticate = async (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const match = /^Basic ([A-Za-z0-9+/]+=*)$/.exec(req.get('authorization') ?? '');
    if (!match) {
        res.set('WWW-Authenticate', 'Basic realm="protected-api"');
        return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = Buffer.from(match[1], 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    const username = separator > 0 ? decoded.slice(0, separator) : '';
    const password = separator > 0 ? decoded.slice(separator + 1) : '';
    const user = users.find((candidate) => candidate.username === username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        logger.warn('Authentication failed', { username: username.slice(0, 64) });
        return res.status(401).json({ error: 'Authentication failed' });
    }
    req.user = { username: user.username, role: user.role };
    authenticatedRequests += 1;
    return next();
};
const requirePlainText = (req, res, next) => {
    if (!req.is('text/plain'))
        return res.status(415).json({ error: 'Content-Type must be text/plain' });
    return next();
};
app.post('/api/data-pipe', authLimiter, authenticate, requirePlainText, (req, res) => {
    const declaredLength = Number(req.get('content-length') ?? 0);
    if (declaredLength > maxRequestBytes)
        return res.status(413).json({ error: 'Request body too large' });
    fs.mkdirSync(dataDirectory, { recursive: true });
    const fileName = `received_data_${randomUUID()}.txt`;
    const writeStream = fs.createWriteStream(path.join(dataDirectory, fileName), { flags: 'wx' });
    let receivedBytes = 0;
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' });
    res.write('Receiving data...\n');
    req.on('data', (chunk) => {
        receivedBytes += chunk.length;
        if (receivedBytes > maxRequestBytes) {
            req.destroy(new Error('Request body too large'));
            writeStream.destroy();
        }
    });
    req.pipe(writeStream);
    writeStream.on('finish', () => res.end('\nData stream processing complete.'));
    writeStream.on('error', (error) => {
        logger.error('Data stream write failed', error);
        if (!res.writableEnded)
            res.end('Error processing stream');
    });
    req.on('error', (error) => {
        logger.error('Data stream request failed', error);
        writeStream.destroy(error);
        if (!res.writableEnded)
            res.end('Error processing stream');
    });
});
app.get('/api/protected', authLimiter, authenticate, (req, res) => {
    res.set('Cache-Control', 'no-store').json({ message: 'Welcome to the protected API.', username: req.user.username });
});
app.get('/api/diagnostics', authLimiter, authenticate, (_req, res) => {
    res.set('Cache-Control', 'no-store').json({
        status: 'ok',
        serverTime: new Date().toISOString(),
        startedAt: serverStartedAt.toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        totalRequests,
        failedRequests,
        authenticatedRequests,
        activeConnections: activeConnectionCount,
        recentEvents: diagnosticEvents
    });
});
app.get('/api/diagnostics/feed', authLimiter, authenticate, (_req, res) => {
    const maxSubscribers = Number(process.env.MAX_DIAGNOSTIC_SUBSCRIBERS ?? 10);
    if (diagnosticSubscribers.size >= maxSubscribers)
        return res.status(429).json({ error: 'Diagnostics feed is at capacity' });
    res.status(200).set({
        'Cache-Control': 'no-store, no-transform',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();
    diagnosticSubscribers.add(res);
    res.write(`event: snapshot\ndata: ${JSON.stringify({
        serverTime: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        totalRequests,
        failedRequests,
        authenticatedRequests,
        activeConnections: activeConnectionCount,
        recentEvents: diagnosticEvents
    })}\n\n`);
    const heartbeat = setInterval(() => {
        if (!res.writableEnded)
            res.write(': heartbeat\n\n');
    }, 15_000);
    const cleanup = () => {
        clearInterval(heartbeat);
        diagnosticSubscribers.delete(res);
    };
    res.on('close', cleanup);
    res.on('error', cleanup);
});
app.use((error, _req, res, next) => {
    logger.error('Unhandled application error', error);
    if (res.headersSent)
        return next(error);
    if (error?.code === 'EBADCSRFTOKEN')
        return res.status(403).json({ error: 'Invalid CSRF token' });
    if (error?.type === 'entity.too.large')
        return res.status(413).json({ error: 'Request body too large' });
    return res.status(500).json({ error: 'Internal Server Error' });
});
const startServers = async () => {
    if (isCodespaces) {
        await listenOnPort(http.createServer(app), PORT, 'Codespaces HTTP');
        serverReady = true;
        return;
    }
    const tlsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certificatePath),
        minVersion: 'TLSv1.2',
        honorCipherOrder: true
    };
    const httpsServer = https.createServer(tlsOptions, app);
    const httpServer = http.createServer((req, res) => {
        const origin = publicOrigin ?? `https://localhost:${HTTPS_PORT}`;
        let redirectUrl;
        try {
            redirectUrl = new URL(req.url ?? '/', origin);
        }
        catch {
            res.writeHead(400);
            res.end('Invalid request URL');
            return;
        }
        res.writeHead(301, { Location: redirectUrl.toString() });
        res.end();
    });
    await Promise.all([
        listenOnPort(httpsServer, HTTPS_PORT, 'HTTPS'),
        listenOnPort(httpServer, PORT, 'HTTP')
    ]);
    serverReady = true;
};
const shutdown = async (signal) => {
    if (shuttingDown)
        return;
    shuttingDown = true;
    logger.info('Server shutdown requested', { signal });
    for (const subscriber of diagnosticSubscribers)
        subscriber.end();
    diagnosticSubscribers.clear();
    await Promise.all([...runningServers].map((server) => new Promise((resolve) => {
        server.close(() => resolve());
    })));
    process.exit(0);
};
process.once('SIGTERM', () => { void shutdown('SIGTERM'); });
process.once('SIGINT', () => { void shutdown('SIGINT'); });
startServers().catch((error) => {
    logger.error('Failed to start servers', error);
    process.exit(1);
});
