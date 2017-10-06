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
    return this.services
      .reduce((p, service) => p.then(service.start()), Promise.resolve());

    // Parallel startup
    // await this.services.map(async service => service.start());
  }

  async stop() {
    const { logger } = this;

    logger.debug('Shutting down application...');

    const reversedServices = [...this.services];
    reversedServices.sort(compareServicesByDependencies);
    reversedServices.reverse();

    // Sequential shutdown
    return reversedServices
      .reduce((p, service) => p.then(service.stop()), Promise.resolve());

    // Parallel shutdown
    // await reversedServices.map(async service => service.stop());
  }
}
