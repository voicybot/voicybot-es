import { services } from '@musicbot/core';

console.log('import { services }:', { services });

const { Service } = services;

class TeamSpeak3ClientService extends Service {
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

export default (app) => {
  const ts3 = new TeamSpeak3ClientService();

  app.pushService(ts3);
};
