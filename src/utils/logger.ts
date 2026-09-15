type LogLevel = 'info' | 'warn' | 'error';

const formatMessage = (level: LogLevel, message: string, meta?: unknown) => {
  const base = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`;
  if (meta === undefined) {
    return base;
  }
  if (meta instanceof Error) {
    return `${base} ${JSON.stringify({ name: meta.name, message: meta.message, stack: meta.stack })}`;
  }
  return `${base} ${JSON.stringify(meta)}`;
};

const logger = {
  info: (message: string, meta?: unknown) => console.log(formatMessage('info', message, meta)),
  warn: (message: string, meta?: unknown) => console.warn(formatMessage('warn', message, meta)),
  error: (message: string, meta?: unknown) => console.error(formatMessage('error', message, meta))
};

export default logger;
