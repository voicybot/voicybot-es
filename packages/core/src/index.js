import * as utilities from './utilities';
import * as logging from './logging';

export * as services from './services';

export config from './config';

// Shared functions
const createLogger = utilities.deprecate((name) => {
  logging.createLogger(name);
});

export {
  createLogger,

  utilities,
  logging,
};

// Shared classes
export Application from './Application';
