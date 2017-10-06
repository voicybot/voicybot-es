import { resolve as resolvePath } from 'path';
// import PulseAudio from 'pulseaudio';
import StreamSplitter from 'stream-splitter';
import Service from '../Service';

export default class PulseAudioService extends Service {
  constructor({ args = [], dependencies = [], ...other } = {}) {
    super({
      args: [
        '--daemonize=false',
        '--fail=true',
        '--log-level=debug', // verbose
        '--log-target=stderr',
        '--realtime', // Try to acquire a real-time scheduling for PulseAudio's I/O threads
        '--use-pid-file=no',
        '-n', // Don't load default script file default.pa on startup
        `--file=${resolvePath(__dirname, 'default.pa')}`,
        ...args,
      ],
      dependencies: [
        'xorg',
        ...dependencies,
      ],
      binaryName: 'pulseaudio',
      name: 'pulseaudio',
      ...other,
    });
  }

  // async connect(): PulseAudio {
  //   return new Promise((resolve, reject) => {
  //     const context = new PulseAudio({
  //       client: 'musicbot',
  //       flags: 'noautospawn',
  //     });
  //
  //     context.once('connection', () => resolve(context));
  //     context.once('error', reject);
  //   });
  // }

  forwardLog(_token) {
    const { logger } = this;

    const token = _token.trim(); // get rid of \r
    const level = token.substring(0, 1).toUpperCase();
    const msg = token.substring(token.indexOf(']') + 2);
    switch (level) {
      case 'D': return logger.silly(msg);
      case 'I': return logger.silly(msg);
      case 'W': return logger.warn(msg);
      case 'E': return logger.error(msg);
      default: return logger.silly(msg);
    }
  }

  getProcessOptions() {
    return {
      ...super.getProcessOptions(),
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    };
  }

  async start() {
    // HACK - can't use await here because of a bug in babel handling super in async functions
    await Service.prototype.start.apply(this);

    return new Promise((resolve, reject) => {
      const service = this;

      const proc = this.subprocess;

      let calledCallback = false;

      // logging
      const tokenHandler = (token) => {
        service.forwardLog(token);

        if (!calledCallback && (
          /* (token.indexOf('client.conf') >= 0) || */
          (token.indexOf('Daemon startup complete.') >= 0))) {
          calledCallback = true;
          this.process = proc;
          setTimeout(resolve, 1500); // TODO: Use some more stable condition
        }
      };

      const stdoutTokenizer = proc.stdout.pipe(StreamSplitter('\n'));
      stdoutTokenizer.encoding = 'utf8';
      stdoutTokenizer.on('token', tokenHandler);

      const stderrTokenizer = proc.stderr.pipe(StreamSplitter('\n'));
      stderrTokenizer.encoding = 'utf8';
      stderrTokenizer.on('token', tokenHandler);

      proc.once('exit', () => {
        if (!calledCallback) {
          calledCallback = true;
          reject(new Error('PulseAudio daemon terminated unexpectedly.'));
        }
      });
    });
  }
}

