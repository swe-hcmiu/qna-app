const winston = require('winston');
const expressWinston = require('express-winston');
const appRoot = require('app-root-path');

const dynamicMetaConfig = (req, res) => {
  return {
    user: (req.user) ? req.user : null,
  };
};

const logFormat = {
  console: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple(),
  ),
  file: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
};

const console = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: logFormat.console,
  level: 'debug',
});

const infoFile = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: `${appRoot}/logs/info.log`,
    }),
  ],
  format: logFormat.file,
  level: 'info',
});

const errorFile = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: `${appRoot}/logs/error.log`,
    }),
  ],
  format: logFormat.file,
  level: 'error',
});

const consoleLogger = expressWinston.logger({
  meta: false,
  expressFormat: true,
  colorize: true,
  winstonInstance: console,
});

const infoFileLogger = expressWinston.logger({
  meta: true,
  expressFormat: true,
  colorize: false,
  dynamicMeta: dynamicMetaConfig,
  winstonInstance: infoFile,
});

const errorFileLogger = expressWinston.logger({
  meta: true,
  expressFormat: true,
  colorize: false,
  dynamicMeta: dynamicMetaConfig,
  winstonInstance: errorFile,
});

module.exports = {
  consoleLogger,
  infoFileLogger,
  errorFileLogger,
};
