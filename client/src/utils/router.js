/* eslint-disable no-underscore-dangle */
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
export const redirect = path => {
  const handler = (ctx, option = {}) => {
    if (!path.includes('/')) {
      throw Error('Invalid path for redirect function');
    }

    const { query, hash } = { ...defaultRedirOp, ...option };

    if (ctx && ctx.res) {
      // => server side redirect
      // => Break function early to avoid endless redirect loop
      if (ctx.req.url === path) {
        // eslint-disable-next-line no-console
        console.error('On recursive redirection at: ', path, query, hash);
        return;
      }
      // eslint-disable-next-line no-use-before-define
      const Location = _withQuery(path, query, hash);
      ctx.res.writeHead(302, { Location });
      ctx.res.end();
    } else {
      // => client side redirect
      // => Break function early to avoid endless redirect loop
      if (ctx && ctx.pathname === path) {
        // eslint-disable-next-line no-console
        console.error('On recursive redirection at: ', path, query, hash);
        return;
      }

      Router.push({
        query,
        hash,
        pathname: path,
      });
    }
  };

  handler.pathname = path;

  return handler;
};

const toIndex = redirect('/');
const toSignin = redirect('/login');
const toSignup = redirect('/signup');
const toProfile = redirect('/profile');
const toFreelancerOnboardingPersonal = redirect('/onboard/freelancer');
const toFreelancerOnboardingPortfolio = redirect(
  '/onboard/freelancer/portfolio',
);
const toError = redirect('/error');
const toPersonalOnboarding = redirect('/onboard/personal');
const toEmployerOnboarding = redirect('/onboard/employer');
const toFreelancerOnboarding = redirect('/onboard/freelancer');

export default {
  toIndex,
  toSignin,
  toSignup,
  toProfile,
  toFreelancerOnboardingPersonal,
  toFreelancerOnboardingPortfolio,
  toError,
  toPersonalOnboarding,
  toEmployerOnboarding,
  toFreelancerOnboarding,
};

/**
 * util for transforming query to string
 */
function _withQuery(path, query, hash) {
  const stringify = Object.keys(query)
    .reduce((all, key) => `${all}${key}=${query[key]}&`, '?')
    .slice(0, -1);

  // eslint-disable-next-line prefer-template
  return `${path}${stringify}${hash && '#' + hash}`;
}
