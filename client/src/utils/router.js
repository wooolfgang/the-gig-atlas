import Router from 'next/router';

/**
 * Curried function that accepts path as first argument and ctx as second
 * Automatically handles client/server redirects
 * @param {*} path
 * todo => Add tests
 */
export const redirect = path => (ctx, query = {}) => {
  if (!path.includes('/')) {
    throw Error('Invalid path for redirect function');
  }

  if (ctx && ctx.res) {
    // => Break function early to avoid endless redirect loop
    if (ctx.req.url === path) {
      return;
    }
    ctx.res.writeHead(302, { Location: path, query });
    ctx.res.end();
  } else {
    // => Break function early to avoid endless redirect loop
    if (ctx && ctx.pathname === path) {
      return;
    }

    Router.push({
      query,
      pathname: path,
    });
  }
};

const toSignin = redirect('/login');
const toSignup = redirect('/signup');
const toProfile = redirect('/profile');
const toFreelancerOnboardingPersonal = redirect('/onboard/freelancer');
const toFreelancerOnboardingPortfolio = redirect(
  '/onboard/freelancer/portfolio',
);
const toError = redirect('/error');

export default {
  toSignin,
  toSignup,
  toProfile,
  toFreelancerOnboardingPersonal,
  toFreelancerOnboardingPortfolio,
  toError,
};
