import createApp from './app';
import config from './config';

(async () => {
  try {
    const app = await createApp();
    const port = config.app.port;

    app.listen(port, () => console.log(`App Live! http://localhost:${port}/`));
  } catch (e) {
    console.error('Failed to run server,', e);
  }
})();
