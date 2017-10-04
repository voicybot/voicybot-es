import { resolve as resolvePath } from 'path';
// import PulseAudio from 'pulseaudio';
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

  start() {
    // HACK: calling original functions via super in async functions is incompatible with Babel < 7
    return super.start('--start');
    // return Service.prototype.start.apply(this, '--start');
  }
}

