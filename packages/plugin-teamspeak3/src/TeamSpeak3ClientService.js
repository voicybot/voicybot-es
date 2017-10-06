import { services } from '@musicbot/core';

const { Service } = services;

export default class TeamSpeak3ClientService extends Service {
  constructor() {
    super({
      name: 'TeamSpeak3',
      binaryName: 'cat',
      dependencies: [
        'pulseaudio',
        'xorg',
      ],
    });
  }
}
