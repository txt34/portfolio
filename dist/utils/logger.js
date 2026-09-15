const formatMessage = (level, message, meta) => {
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
    info: (message, meta) => console.log(formatMessage('info', message, meta)),
    warn: (message, meta) => console.warn(formatMessage('warn', message, meta)),
    error: (message, meta) => console.error(formatMessage('error', message, meta))
};
export default logger;
