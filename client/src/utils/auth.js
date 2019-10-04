/* eslint-disable import/prefer-default-export */
import { setCookie, parseCookies, destroyCookie } from 'nookies';
/**
 * Set token to cookies at path "/"
 * @param {String} token jwt
 */
const setTokenCookie = (token, ctx) => {
  console.log('here setting token', token);
  setCookie(ctx, 'token', token, { path: '/' });
};

/**
 * Get token from cookies
 * @param {Object} ctx ctx object for ssr
 */
const getToken = ctx => parseCookies(ctx && ctx.req ? ctx : undefined).token;

/**
 * Remove token
 * @param {Object} ctx context object
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
