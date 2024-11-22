// logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log', level: 'info' }), // Logs all info-level messages
    new transports.File({ filename: 'error.log', level: 'error' }), // Logs only error-level messages
  ],
});

export default logger;
