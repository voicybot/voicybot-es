import TeamSpeak3ClientService from './TeamSpeak3ClientService';

export default (app) => {
  const ts3 = new TeamSpeak3ClientService();

  app.pushService(ts3);
};
