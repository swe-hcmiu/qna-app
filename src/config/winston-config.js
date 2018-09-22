const winston = require('winston');
const expressWinston = require('express-winston');
const appRoot = require('app-root-path');

const dynamicMetaConfig = (req, res) => {
  return {
    user: (req.user) ? req.user : null,
  };
};

const options = {
  info: {
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      new winston.transports.File({
        json: true,
        colorize: false,
        filename: `${appRoot}/logs/info.log`,
      }),
    ],
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    ignoreRoute: (req, res) => { return false; },
    dynamicMeta: dynamicMetaConfig,
  },

};

const logger = expressWinston.logger(options.info);

module.exports = logger;
