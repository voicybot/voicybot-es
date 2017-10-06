import { spawn } from 'child_process';
import procenv from './process_environment';
import { Logger } from '../logging';

export default class Service {
  constructor({
    args,
    binaryName,
    dependencies = [],
    environment = {},
    name = binaryName,
  }) {
    Object.assign(this, {
      args,
      binaryName,
      dependencies,
      environment: {
        ...procenv,
        ...environment,
      },
      logger: new Logger(`service:${name}`),
      name,
    });
  }

  getProcessArguments(...args) {
    return [
      ...args,
      ...this.args,
    ];
  }

  start(...args) {
    const finalArgs = this.getProcessArguments(...args);

    this.logger.info(`${this.binaryName} arguments:`, finalArgs);

    this.logger.info(`${this.binaryName} starting...`);

    this.subprocess = spawn(this.binaryName, finalArgs, {
      detached: false,
      stdio: 'inherit',
      environment: this.environment,
    });
  }

  async stop() {
    return new Promise((resolve) => {
      if (!this.subprocess) {
        return;
      }

      this.logger.info('Xorg stopping...');

      this.subprocess.once('exit', (code) => {
        resolve(code);
      });

      this.subprocess.kill();
    });
  }
}
