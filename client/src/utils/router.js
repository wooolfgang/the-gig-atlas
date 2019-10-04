import Router from 'next/router';

/**
 * Redirect to signin page
 * @param {Object} ctx provide ctx object to determine either Server or browser
 */
const toSignin = ctx => {
  if (ctx && ctx.res) {
    ctx.res.writeHead(302, { Location: '/auth/signin' });
    ctx.res.end();
  } else {
    Router.push('/auth/signin');
  }
};

const toSignup = () => {
  Router.push('/auth/signup');
};

/**
 * Redirect to profile page
 * @param {Object} ctx provide ctx object to determine either Server or browser
 */
const toProfile = ctx => {
  if (ctx && ctx.res) {
    ctx.res.writeHead(302, { Location: '/profile' });
    ctx.res.end();
  } else {
    Router.push('/profile');
  }
};

export default {
  toSignin,
  toSignup,
  toProfile,
};
