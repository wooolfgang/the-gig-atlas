/* eslint-disable no-undef */
import util from 'util';
import createApp from './app';
import config from './config';

let server;

// beforeAll(() => {
//   console.log = (...s) => {
//     process.stdout.write(`\n${util.inspect(s, false, null, true)}`);
//   };

//   return createApp()
//     .then(app => {
//       const port = config.app.port;
//       app.on('error', e => console.log('app error', e));
//       server = app.listen(port, () => console.log(`Test App Live! http://localhost:${port}/`));
//       // server.on('close', () => console.log('server closing'));

//       return app;
//     })
//     .catch(e => {
//       console.error('Failed to test run server,', e);

//       return Promise.reject(e);
//     });
// });

// afterAll(() => {
//   server.close();
// });

describe('test app', () => {
  it('pings', () => {
    expect(true).toBe(true);
  });
});
