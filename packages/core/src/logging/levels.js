import log from 'npmlog';

log.addLevel('debug', 1250, { fg: 'blue', bg: 'black' });
log.addLevel('success', 3250, { fg: 'green', bg: 'black' });

log.level = 'silly';
