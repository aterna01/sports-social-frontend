const { createLogger, format, transports } = require('winston')

const createCustomLogger = defaultConfig =>
  createLogger({
    transports: [
      new transports.Console({
        handleExceptions: true,
        format: format.json(),
      }),
    ],
  })

module.exports = {
  createCustomLogger,
}
