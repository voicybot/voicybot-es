import convict from 'convict';

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

// Perform validation
config.validate({ allowed: 'strict' });

export default config;
