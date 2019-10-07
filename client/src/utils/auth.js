/* eslint-disable import/prefer-default-export */
import { setCookie, parseCookies, destroyCookie } from 'nookies';
/**
 * Set token to cookies at path "/"
 * @param {String} token jwt credential
 * @param {Object} ctx provide ctx to determine from server or browser
 */
const setTokenCookie = (token, ctx) => {
  setCookie(ctx, 'token', token, { path: '/' });
};

/**
 * Get token from cookies
 * @param {Object} ctx ctx to determine server or browser
 */
const getToken = ctx => parseCookies(ctx && ctx.req ? ctx : undefined).token;

/**
 * Remove token
 * @param {Object} ctx to determine server or browser
 */
const logout = (ctx = undefined) => {
  destroyCookie(ctx, 'token');
  window.localStorage.setItem('logout', Date.now());
};

export default {
  setTokenCookie,
  logout,
  getToken,
};
