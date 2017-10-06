import {
  XorgService,
  PulseAudioService,
} from './services';
import { Logger } from './logging';

function compareServicesByDependencies(a, b) {
  if (a.dependencies.indexOf(b.name) >= 0) {
    return -1;
  }
  if (b.dependencies.indexOf(a.name) >= 0) {
    return 1;
  }
  return 0;
}

export default class Application {
  constructor() {
    this.services = [
      new XorgService(),
      new PulseAudioService(),
    ];
    this.logger = new Logger('app');
  }

  pushService(...services) {
    this.logger.debug('Registering services:', ...services.map(service => service.name));
    this.services.push(...services);
  }

  async start() {
    const { logger } = this;

    logger.debug('Starting application...');

    const sortedServices = [...this.services];
    sortedServices.sort(compareServicesByDependencies);

    // Sequential startup
    return sortedServices
      .reduce(
        (p, service) => p
          .then(() => {
            logger.info('Starting service:', service.name);
          })
          .then(() => service.start())
          .then(() => {
            logger.info('Started service:', service.name);
          }),
        Promise.resolve(),
      );
  }

  async stop() {
    const { logger } = this;

    logger.debug('Shutting down application...');

    const reversedServices = [...this.services];
    reversedServices.sort(compareServicesByDependencies);
    reversedServices.reverse();

    // Sequential shutdown
    return reversedServices
      .reduce(
        (p, service) => p
          .then(() => {
            logger.info('Stopping service:', service.name);
          })
          .then(() => service.stop())
          .then(() => {
            logger.info('Stopped service:', service.name);
          }),
        Promise.resolve(),
      );
  }
}
