/* eslint-disable import/prefer-default-export */
import { google } from 'googleapis';
import config from '../config';

const plus = google.plus('v1');
// const { oauth } = config;
const { id: clientId, secret, redirectURI } = config.googleOauth;
const oauth2Client = new google.auth.OAuth2(clientId, secret, redirectURI);

google.options({ auth: oauth2Client });

function getConnectionUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'openid email profile',
  });
  // [ref] => https://developers.google.com/+/api/oauth#obtaininguserprofileinformation
}

/**
 * @param {String} code variable from after sucessful google auth redirect parameter
 */
async function getUserData(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.credentials = tokens; // googles oop magic for maybe their statuful api
  // connect to google plus - need this to get the user's email
  const res = await plus.people.get({ userId: 'me' });
  const { id, emails, name, image } = res.data;

  let imageUrl = null;
  if (image && image.url) {
    // Resize image to dimensions 200 x 200
    imageUrl = image.url.replace('s50', 's200');
  }

  return {
    id,
    email: emails[0].value,
    firstName: name.givenName,
    lastName: name.familyName,
    imageUrl,
    token: tokens,
  };
}

export { getConnectionUrl, getUserData };
export default { getConnectionUrl, getUserData };

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
