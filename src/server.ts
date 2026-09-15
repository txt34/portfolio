import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import logger from './utils/logger';
import client from 'prom-client';
import { exampleApiHandler } from './api/example-api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Placeholder for SSL certificates (for local development)
// In production, these would be managed securely.
const options = {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem')
};

app.use(express.json());
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
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
app.use((req, res, next) => {
  activeConnections.inc();
  res.on('finish', () => {
    activeConnections.dec();
  });
  next();
});

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      code: res.statusCode,
    });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// CSRF Protection
app.use(cookieParser());
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  logger.error('SESSION_SECRET is not defined. Please set it in your .env file or environment variables.');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required in production!');
  } else {
    logger.warn('Using a default session secret for development. Set SESSION_SECRET for better security.');
  }
}

app.use(session({
  secret: sessionSecret || 'development_secret', // Fallback for development only
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, sameSite: 'strict' }
}));
app.use(csurf({ cookie: true }));

// Provide CSRF token to frontend
app.get('/api/csrf-token', (req: express.Request, res: express.Response) => {
  res.json({ csrfToken: req.csrfToken() });
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

// Start HTTPS server
https.createServer(options, app).listen(HTTPS_PORT, () => {
  logger.info(`HTTPS Server running on port ${HTTPS_PORT}`);
});

// Start HTTP server for redirection
http.createServer((req, res) => {
  logger.info(`HTTP request on port ${PORT}. Redirecting to HTTPS...`, { originalUrl: req.url });
  res.writeHead(301, { "Location": "https://" + req.headers.host?.split(':')[0] + ':' + HTTPS_PORT + req.url });
  res.end();
}).listen(PORT, () => {
  logger.info(`HTTP Server running on port ${PORT}. Redirecting to HTTPS...`);
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled application error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('Something went wrong!');
});