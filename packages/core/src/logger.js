import { deprecate } from './utilities';
import { createLogger } from './logging';

export default deprecate((name) => {
  createLogger(name);
});
