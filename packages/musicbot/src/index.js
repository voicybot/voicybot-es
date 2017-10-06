import { exit } from 'process';
import { logging } from '@musicbot/core';

import main from './main';

const { Logger } = logging;
const logger = new Logger('app');

// Only run main code if this application is executed directly from CLI
main()
  .catch((err) => {
    logger.error(err);
    exit(1);
  });
