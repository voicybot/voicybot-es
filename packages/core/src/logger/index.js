import { createLogger as createBunyanLogger } from 'bunyan';

export default function createLogger(name, opts) {
  return createBunyanLogger({
    name,
    ...opts,
  });
}
