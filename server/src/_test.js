import createApp from './app';
import config from './config';

// eslint-disable-next-line no-undef

let app;

beforeAll(async () => {
  try {
    app = await createApp();
    const port = config.app.port;

    app.listen(port, () => console.log(`Test App Live! http://localhost:${port}/`));
  } catch (e) {
    console.error('Failed to test run server,', e);
  }
});

afterAll(() => {
  app.close();
})
