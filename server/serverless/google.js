import { google } from 'googleapis';
import { oauth } from '../src/config';

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

function createConnection() {
  return new google.auth.OAuth2(
    oauth.idClient,
    oauth.secretClient,
    oauth.redirectUri,
  );
}

function getConnectionUrl() {
  const auth = createConnection();

  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope,
  });
}

export { getConnectionUrl };

/**
 * @references
 * https://developers.google.com/identity/protocols/OAuth2WebServer
 * https://medium.com/@jackrobertscott/how-to-use-google-auth-api-with-node-js-888304f7e3a0
 * https://googleapis.dev/nodejs/googleapis/latest/oauth2/index.html
 * https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/oauth2.js
 * https://googleapis.dev/nodejs/googleapis/latest/index.html
 *  //
 * https://console.developers.google.com/apis/dashboard?project=the-gig-atlas
 */
