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
    let authenticatedUser;

    if ((type === 'ADMIN' || type === 'MEMBER' || type === 'auth') && !token) {
      // => allow "all" type user with no token
      // => disallow role type user with no token
      router.toSignin(ctx);

      return {};
    }

    try {
      const { data } = await ctx.apolloClient.query({
        query: GET_AUTHENTICATED_USER,
        // fetchPolicy: 'network-only', // => Make sure to always fetch network first, as apollo defaults to cache
      });

      authenticatedUser = data.authenticatedUser;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('AuthenticatedUser', e);
      if (type !== 'all') {
        router.toSignin(ctx);

        return {};
      }
    }

    if (!authenticatedUser && type !== 'all') {
      router.toSignin(ctx);

      return {};
    }

    if (authenticatedUser) {
      // [info]=> refactored Li's code
      const onboardingStep = authenticatedUser.freelancerOnboardingStep;
      if (onboardingStep !== 'FINISHED') {
        if (onboardingStep === 'PORTFOLIO') {
          router.toFreelancerOnboardingPortfolio(ctx);
        } else {
          router.toFreelancerOnboardingPersonal(ctx);
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
      authenticatedUser,
      token,
    };
  };

  return Wrapper;
};

export default withAuthSync;
