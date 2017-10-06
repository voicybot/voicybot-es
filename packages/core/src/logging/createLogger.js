import Logger from './Logger';

export default function createLogger(name) {
  return new Logger(name);
}
