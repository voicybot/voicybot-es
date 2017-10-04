import { Application, config } from '@musicbot/core';

const app = new Application();

async function gracefulShutdown() {
  // @TODO - wait for some sort of control input

  await app.stop();
}

export default async function main() {
  await Promise.all(config.get('plugins')
    .map(async pluginName => import(pluginName)));
  await app.start();

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}
