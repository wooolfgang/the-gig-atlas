/* eslint-disable import/prefer-default-export */
import { setCookie } from 'nookies';
// /* eslint-disable import/prefer-default-export */
// /* eslint-disable import/no-named-as-default-member */
// import Router from 'next/router';
// // import nextCookie from 'next-cookies';
// // import cookie from 'js-cookie';
// // import router from './router';

// export const login = ({ token }) => {
//   // cookie.set('token', token);
//   Router.push('/profile');
// };

// // /**
// //  * Verify user authentication
// //  * @param {Object} ctx next context
// //  */
// // export const auth = ctx => {
// //   // get token from cookie
// //   const { token } = nextCookie(ctx);
// //   console.log('token from cookie: ', token);

// //   if (ctx.req && !token) {
// //     ctx.res.writeHead(302, { Location: '/auth/signin' });
// //     ctx.res.end();
// //   }

// //   // We already checked for server. This should only happen on client.
// //   if (!token) {
// //     router.toSignin();
// //   }

// //   return token;
// // };

/**
 * Set token to cookies at path "/"
 * @param {String} token jwt
 */
const setTokenCookie = token => setCookie({}, 'token', token, { path: '/' });

export default {
  setTokenCookie,
};
