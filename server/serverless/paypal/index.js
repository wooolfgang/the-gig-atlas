/* eslint-disable no-console */
/* eslint-disable import/named */
// import util from './util';
import { getCDN } from './connect';

// let auth;

// /**
//  * Handle on payment completion
//  * @param {String} id order id
//  */
// export async function completePayment(id) {
//   const
// }

/**
 * Query oauth2 token from paypal
 * @returns Object { access_token, token_type, app_id, expires_in, nonce, scope(omitted) }
 */
// export async function getToken() {
//   // => paypal only supports v1 oauth2
//   const url = `${uri}/v1/oauth2/token?grant_type=client_credentials`;
//   const config = {
//     headers: {
//       Accept: 'application/json',
//       'Content-type': 'application/x-www-form-urlencoded',
//       'Accept-Language': 'en_US',
//     },
//     auth: { username: clientId, password: clientSecret },
//   };
//   try {
//     const { data } = await axios.post(url, {}, config);
//     // eslint-disable-next-line no-unused-vars
//     const { scope, ...rest } = data;
//     console.log(rest);
//     auth = rest;

//     return auth;
//   } catch (e) {
//     console.log('ERROR on paypal authentication');
//     console.log(e.response.data);

//     throw e;
//   }
// }

export default {
  getCDN,
  // getToken,
};
