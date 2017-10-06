import { Logger } from '../logging';

const logger = new Logger('deprecation');

export default function deprecate(func) {
  const actualFunc = func.bind(this);

  return (...args) => {
    logger.warn('deprecated function called:', func.name);

    return actualFunc(...args);
  };
}
