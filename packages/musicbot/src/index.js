import { exit } from 'process';

import main from './main';

// Only run main code if this application is executed directly from CLI
main()
  .catch((err) => {
    console.error(err);
    exit(1);
  });
