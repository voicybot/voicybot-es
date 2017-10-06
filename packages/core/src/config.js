import convict from 'convict';
import { Logger } from './logging';

convict.addFormat({
  name: 'StringArray',
  validate: (val) => {
    if (!Array.isArray(val) || !val.every(item => typeof item === 'string')) {
      throw new Error('must be a string array');
    }
  },
});

const config = convict({
  plugins: {
    format: 'StringArray',
    default: [],
  },
});

config.loadFile([
  './config.json',
]);

const logger = new Logger('config');

logger.debug('Loaded configuration:', config.toString());

// Perform validation
logger.debug('Validating configuration...');
config.validate({ allowed: 'strict' });
logger.debug('Configuration validated.');

export default config;
