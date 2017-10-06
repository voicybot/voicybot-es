import { resolve as resolvePath } from 'path';
import StreamSplitter from 'stream-splitter';
import Service from '../Service';

const xorgLogMatcher = /^\((--|\*\*|==|\+\+|!!|II|WW|EE|NI|\?\?)\) (.+)$/;

export default class XorgService extends Service {
  constructor({
    args = [],
    extensions = [],
    display = ':99',
    ...other
  } = {}) {
    super({
      args: [
        '-noreset',
        '-logfile', '/dev/null',
        '-config', resolvePath(__dirname, 'xorg.conf'),
        ...args,
      ],
      binaryName: 'Xorg',
      name: 'xorg',
      ...other,
    });

    Object.assign(this, {
      extensions,
      display,
    });
  }

  forwardLog(_token) {
    const { logger } = this;

    const token = _token.trim(); // get rid of \r

    const logMatch = xorgLogMatcher.exec(token);
    if (logMatch) {
      switch (logMatch[1]) {
        // case "--": // probed
        // case "**": // from config file
        // case "==": // default setting
        // case "++": // from command line
        case '!!': // notice
          logger.notice(logMatch[2]);
          break;
        case 'II': // info
          logger.info(logMatch[2]);
          break;
        case 'WW': // warn
        case 'NI': // not implemented
          logger.warn(logMatch[2]);
          break;
        case 'EE': // error
          logger.error(logMatch[2]);
          break;
          // case "??": // Unknown
        default:
          logger.debug(logMatch[2]);
          break;
      }
      return;
    }

    logger.debug(token);
  }

  getProcessOptions() {
    return {
      ...super.getProcessOptions(),
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    };
  }

  getProcessArguments(...args) {
    return super.getProcessArguments(
      ...this.extensions.reduce((arr, cur) => [...arr, '+extension', cur], []),
      ...args,
      this.display,
    );
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
          (token.indexOf('Using system config directory') >= 0))) {
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
          reject(new Error('X server terminated unexpectedly.'));
        }
      });
    });
  }
}
