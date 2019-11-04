import Router from 'next/router';

const defaultRedirOp = {
  query: {},
  hash: '',
};

/**
 * Curried function that accepts path as first argument and ctx as second
 * Automatically handles client/server redirects
 * @param {*} path
 * todo => Add tests
 */
export const redirect = path => (ctx, option = {}) => {
  if (!path.includes('/')) {
    throw Error('Invalid path for redirect function');
  }

  const { query, hash } = { ...defaultRedirOp, ...option };

  if (ctx && ctx.res) {
    // => server side redirect
    // => Break function early to avoid endless redirect loop
    if (ctx.req.url === path) {
      // eslint-disable-next-line no-console
      console.error('On recursive redirection at: ', path);
      return;
    }
    ctx.res.writeHead(302, { Location: path, query, hash });
    ctx.res.end();
  } else {
    // => client side redirect
    // => Break function early to avoid endless redirect loop
    if (ctx && ctx.pathname === path) {
      // eslint-disable-next-line no-console
      console.error('On recursive redirection at: ', path);
      return;
    }

    Router.push({
      query,
      hash,
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
const toOnboarding = redirect('/onboard');

export default {
  toSignin,
  toSignup,
  toProfile,
  toFreelancerOnboardingPersonal,
  toFreelancerOnboardingPortfolio,
  toError,
  toOnboarding,
};
