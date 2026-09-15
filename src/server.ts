import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import logger from './utils/logger.js';
import client from 'prom-client';
import { exampleApiHandler } from './api/example-api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: express.Express = express();
const PORT = Number(process.env.PORT || 3000);
const HTTPS_PORT = Number(process.env.HTTPS_PORT || 3443);
const CERT_DIR = path.resolve(__dirname, '..', 'certificates');
const KEY_PATH = path.join(CERT_DIR, 'key.pem');
const CERT_PATH = path.join(CERT_DIR, 'cert.pem');

const findAvailablePort = (startPort: number): Promise<number> =>
  new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      const tester = http.createServer();
      tester.once('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          tryPort(port + 1);
          return;
        }
        reject(error);
      });
      tester.once('listening', () => {
        const address = tester.address();
        const chosenPort = typeof address === 'object' && address ? address.port : port;
        tester.close(() => resolve(chosenPort));
      });
      tester.listen(port);
    };

    tryPort(startPort);
  });

if (!fs.existsSync(KEY_PATH) || !fs.existsSync(CERT_PATH)) {
  logger.warn('Local HTTPS certificate not found; generating a self-signed certificate for development.');
  fs.mkdirSync(CERT_DIR, { recursive: true });
  const { execSync } = await import('node:child_process');
  execSync(`openssl req -x509 -newkey rsa:2048 -keyout "${KEY_PATH}" -out "${CERT_PATH}" -days 365 -nodes -subj "/CN=localhost"`, { stdio: 'inherit' });
}

const options = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH)
};

app.use(express.json() as express.RequestHandler);
app.use(helmet() as express.RequestHandler);

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
}) as express.RequestHandler;
app.use(limiter);

// Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();

collectDefaultMetrics({ register });

// Custom Metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 5000],
});
register.registerMetric(httpRequestDurationMicroseconds);

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});
register.registerMetric(activeConnections);

// Middleware to track active connections
app.use(((req: express.Request, res: express.Response, next: express.NextFunction) => {
  activeConnections.inc();
  res.on('finish', () => {
    activeConnections.dec();
  });
  next();
}) as express.RequestHandler);

// Middleware to measure request duration
app.use(((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      code: res.statusCode,
    });
  });
  next();
}) as express.RequestHandler);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// CSRF Protection
app.use(cookieParser() as express.RequestHandler);
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required in production!');
  }
  logger.warn('SESSION_SECRET is not defined. Using a default session secret for development. Set SESSION_SECRET in a local .env file for better security.');
}

app.use(session({
  secret: sessionSecret || 'development_secret', // Fallback for development only
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, sameSite: 'strict' }
}) as express.RequestHandler);
app.use(csurf({ cookie: true }) as express.RequestHandler);

// Provide CSRF token to frontend
app.get('/api/csrf-token', (req: express.Request, res: express.Response) => {
  const requestWithCsrf = req as express.Request & { csrfToken: () => string };
  res.json({ csrfToken: requestWithCsrf.csrfToken() });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js API Server!');
});

// Database connection placeholder
// In a real application, you would connect to your database here (e.g., PostgreSQL, MongoDB).
// Ensure to use parameterized queries to prevent SQL injection.
// Example: const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Then use pool.query('SELECT * FROM users WHERE id = $1', [userId]);

app.get('/api/example',
  [body('name').trim().escape().isLength({ min: 1 }).withMessage('Name is required')],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const result = await exampleApiHandler(req.query);
      logger.info('Example API success', { query: req.query });
      res.json(result);
    } catch (error) {
      logger.error('Error in example API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

app.post('/api/data-pipe', (req, res) => {
  logger.info('Data pipe endpoint hit. Streaming data to file...');

  const fileName = `received_data_${Date.now()}.txt`;
  const filePath = path.join(__dirname, '..', '..', fileName);
  const writeStream = fs.createWriteStream(filePath);

  // Set response headers for streaming
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Transfer-Encoding': 'chunked' });
  res.write(`Receiving data and writing to ${fileName}...\n`);

  // Pipe the incoming request stream directly to the file stream
  req.pipe(writeStream);

  writeStream.on('finish', () => {
    logger.info('Finished receiving data stream and writing to file.', { filePath });
    res.end(`\nData stream processing complete! Data written to ${fileName}`);
  });

  writeStream.on('error', (err) => {
    logger.error('Error writing to file stream:', err);
    res.end('Error processing stream');
  });

  req.on('error', (err) => {
    logger.error('Stream error during data piping (request side):', err);
    // If request stream errors, also destroy the write stream
    writeStream.destroy(err);
    res.end('Error processing stream');
  });
});

// Mock Authentication Middleware
  // In a production environment, you would integrate with a proper user management system,
  // handle password hashing securely (e.g., using bcryptjs to compare stored hashes),
  // and potentially use JWTs or more advanced session management.
  const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn('Authentication failed: No authorization header');
    return res.status(401).send('Authentication required');
  }

  const [type, credentials] = authHeader.split(' ');

  if (type === 'Basic') {
      const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
      // In a real application, you would:
      // 1. Fetch the user from a database.
      // 2. Hash the provided password using bcryptjs and compare it with the stored hash.
      //    Example: const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (username === 'user' && password === 'password') { // NEVER use hardcoded passwords in production!
        req.user = { username: 'user', role: 'user' }; // Attach user info to request
        logger.info('User authenticated successfully', { username: req.user.username });
        next();
      } else if (username === 'admin' && password === 'password') { // Mock admin user
        req.user = { username: 'admin', role: 'admin' };
        logger.info('Admin authenticated successfully', { username: req.user.username });
        next();
      } else {
        logger.warn('Authentication failed: Invalid credentials', { username });
        res.status(401).send('Invalid credentials');
      }
    } else {
      logger.warn('Authentication failed: Unsupported authentication type', { type });
      res.status(401).send('Unsupported authentication type');
    }
  };
app.get('/api/protected', authenticate, (req: any, res) => {
  logger.info('Access to protected API granted', { username: req.user.username });
  res.send(`Welcome to the protected API, ${req.user.username}!`);
});

// Mock Authorization Middleware
// In a production environment, authorization would typically involve querying a database
// or an identity provider to determine the authenticated user's roles or permissions
// and then enforcing access based on those.
const authorize = (roles: string[]) => (req: any, res: any, next: any) => {
  if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
    logger.warn('Authorization failed', { username: req.user?.username, requiredRoles: roles, userRole: req.user?.role });
    return res.status(403).send('Forbidden');
  }
  logger.info('Authorization granted', { username: req.user.username, requiredRoles: roles });
  next();
};

app.get('/api/admin', authenticate, authorize(['admin']), (req: any, res) => {
  logger.info('Access to admin API granted', { username: req.user.username });
  res.send(`Welcome to the admin API, ${req.user.username}! You have admin privileges.`);
});

const startServers = async () => {
  const httpPort = await findAvailablePort(PORT);
  const httpsPort = await findAvailablePort(HTTPS_PORT);

  https.createServer(options, app).listen(httpsPort, () => {
    logger.info(`HTTPS Server running on port ${httpsPort}`);
  });

  http.createServer((req, res) => {
    logger.info(`HTTP request on port ${httpPort}. Redirecting to HTTPS...`, { originalUrl: req.url });
    res.writeHead(301, { "Location": "https://" + req.headers.host?.split(':')[0] + ':' + httpsPort + req.url });
    res.end();
  }).listen(httpPort, () => {
    logger.info(`HTTP Server running on port ${httpPort}. Redirecting to HTTPS...`);
  });
};

startServers().catch((error) => {
  logger.error('Failed to start servers', error);
  process.exit(1);
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled application error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('Something went wrong!');
});