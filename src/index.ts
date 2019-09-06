import {TodoListApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export async function main(options: ApplicationConfig = {}) {
  const app = new TodoListApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

export {TodoListApplication};

export * from './models';
export * from './repositories';
export * from '@loopback/rest';
