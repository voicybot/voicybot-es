import { resolve as resolvePath } from 'path';
import Service from '../Service';

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

  getProcessArguments(...args) {
    return super.getProcessArguments(
      ...this.extensions.reduce((arr, cur) => [...arr, '+extension', cur], []),
      ...args,
      this.display,
    );
  }
}
