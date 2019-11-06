/* eslint-disable no-use-before-define */
/* eslint-disable import/no-named-as-default-member */
import React, { useEffect } from 'react';
import router from '../../utils/router';
import { GET_AUTHENTICATED_USER } from '../../graphql/auth';
import auth from '../../utils/auth';

/**
 * Wrapped component that needs authentication
 * @param {object} WrappedComponent react component to be wrapped
 * @param {string} type - [all|auth|ADMIN|MEMBER] type of user role needed to acess
 *  - 'all' type allow both auth and non auth user
 *  - 'auth' type allow only authenticated user
 *  - 'ADMIN|MEMBER' specify role of authenticated user
 */
const withAuthSync = (WrappedComponent, type) => {
  if (!type) {
    throw new Error('Failed to set "type" parameter for WithAuthSync wrapper');
  }

  const Wrapper = props => {
    // => set logout details on local storage after trigger user logout (auth.logout)
    const syncLogout = event => {
      if (event.key === 'logout') {
        router.toSignin();
      }
    };
    useEffect(() => {
      // => set logout effects
      window.addEventListener('storage', syncLogout);
      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async ctx => {
    // => Authenticates User Component with valid token
    const token = auth.getToken(ctx);
    let user;

    if ((type === 'ADMIN' || type === 'MEMBER' || type === 'auth') && !token) {
      // => allow "all" type user with no token
      // => disallow role type user with no token
      router.toSignin(ctx);

      return {};
    }

    try {
      if (token) {
        // => if type is 'all' with no token, skip this
        const res = await ctx.apolloClient.query({
          query: GET_AUTHENTICATED_USER,
          // fetchPolicy: 'network-only', // => Make sure to always fetch network first, as apollo defaults to cache
        });
        user = res.data.authenticatedUser;
        console.log('the user: ', user);
        if (!user) {
          // => for user dont exist
          router.toSignin(ctx);
          // @todo: to handle 'if' error?
          return {};
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error WithAuthSync');
      // eslint-disable-next-line no-console
      console.error(e);
      const query = {
        message: 'WithAuthSync: Something went wrong',
      };
      router.toError(ctx, { query });

      return {};
    }

    /**
     * @hook user onboarding
     */
    if (user && user.onboardingStep) {
      const currentStep = ctx.query.step;
      const currentPath = ctx.pathname;
      const { onboardingStep } = user;

      if (
        currentPath !== router.toOnboarding.pathname &&
        currentStep !== onboardingStep
      ) {
        if (onboardingStep === 'PERSONAL') {
          const query = { step: onboardingStep };
          router.toOnboarding(ctx, { query });
        }
        // => Do not go for early return, as we need to pass user down as props
      }
    }

    let componentProps = {};
    if (WrappedComponent.getInitialProps) {
      componentProps = await WrappedComponent.getInitialProps(ctx);
    }

    return {
      ...componentProps,
      user,
      token,
    };
  };

  return Wrapper;
};

export default withAuthSync;
