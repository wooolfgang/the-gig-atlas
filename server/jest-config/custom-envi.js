/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import NodeEnvironment from 'jest-environment-node';
import createApp from '../src/app';
import config from '../src/config';

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    // code

    const port = config.app.port;
    const app = await createApp();
    // eslint-disable-next-line prettier/prettier
    this.server = app.listen(port, () => console.log(`Server Open! http://localhost:${port}/`));
    this.server.on('close', () => console.log('Server closed'));
  }

  async teardown() {
    // code
    this.server.close();
    await super.teardown();
  }
}

export default CustomEnvironment;
