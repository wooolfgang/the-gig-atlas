/* eslint-disable import/prefer-default-export */
import { setCookie, parseCookies, destroyCookie } from 'nookies';

const TOKEN_KEY = '_1';
const OAUTH_STATE_KEY = '_2';

/**
 * Set token to cookies at path "/"
 * @param {String} token jwt credential
 * @param {Object} ctx provide ctx to determine from server or browser
 */
const setTokenCookie = (token, ctx) => {
  setCookie(ctx, TOKEN_KEY, token, { path: '/' });
};

/**
 * Get token from cookies
 * @param {Object} ctx ctx to determine server or browser
 */
const getToken = ctx =>
  parseCookies(ctx && ctx.req ? ctx : undefined)[TOKEN_KEY];

/**
 * Remove token
 * @param {Object} ctx to determine server or browser
 */
const logout = (ctx = undefined) => {
  destroyCookie(ctx, TOKEN_KEY, { path: '/' });
  window.localStorage.setItem('logout', Date.now());
};

/**
 * Generate 40 random character for Oauth2 state param
 * @param {Object} ctx ctx object to determine server/browser (browser mostly)
 */
const generateRandomState = ctx => {
  const { crypto } = ctx && ctx.req ? global : window;
  const validChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let array = new Uint8Array(40);

  crypto.getRandomValues(array);
  array = array.map(x => validChars.charCodeAt(x % validChars.length));
  const randomState = String.fromCharCode.apply(null, array);

  return randomState;
  // [ref]=> https://medium.com/@dazcyril/generating-cryptographic-random-state-in-javascript-in-the-browser-c538b3daae50
};

/**
 * Generate new OAuth state to append to URL and add to cookies
 * @param {Object} url the outh2 URL signin
 * @param {Object} ctx obtional ctx
 */
const setOauthState = (url, ctx) => {
  const state = generateRandomState(ctx);
  setCookie(ctx, OAUTH_STATE_KEY, state, { path: '/' });

  return url.concat(`&state=${state}`);
  // [ref]=> https://auth0.com/docs/protocols/oauth2/oauth-state
};

const getState = ctx =>
  parseCookies(ctx && ctx.req ? ctx : undefined)[OAUTH_STATE_KEY];

const removeStateCookie = (ctx = undefined) => {
  destroyCookie(ctx, OAUTH_STATE_KEY, { path: '/' });
};

export default {
  setTokenCookie,
  logout,
  getToken,
  setOauthState,
  getState,
  removeStateCookie,
};
