import log from 'npmlog';

export default class Logger {
  constructor(name) {
    Object.assign(this, {
      name,
    });

    const logger = this;

    [
      'silly',
      'debug',
      'verbose',
      'info',
      // 'timing',
      'http',
      'notice',
      'warn',
      'error',
      'silent',
    ].forEach((level) => {
      logger[level] = log[level].bind(log, name);
    });
  }

  log(level, message, ...args) {
    log.log(level, this.name, ...args);
  }
}
