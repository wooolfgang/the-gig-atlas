/* eslint-disable import/no-named-as-default-member */
import React, { useEffect } from 'react';
import router from '../../utils/router';
import { GET_AUTHENTICATED_USER } from '../../graphql/auth';
import auth from '../../utils/auth';

/**
 * Wrapped component that needs authentication
 * @param {React.Component} WrappedComponent react component to be wrapped
 */
const withAuthSync = WrappedComponent => {
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
    const { apolloClient } = ctx;
    const token = auth.getToken(ctx);

    if (!token) {
      router.toSignin(ctx);

      return {};
    }

    const res = await apolloClient.query({
      query: GET_AUTHENTICATED_USER,
      // => Make sure to always fetch network first, as apollo defaults to cache
      fetchPolicy: 'network-only',
    });

    if (!res.data.authenticatedUser) {
      router.toSignin(ctx);

      return {};
    }

    const onboardingStep = res.data.authenticatedUser.freelancerOnboardingStep;
    if (onboardingStep !== 'FINISHED') {
      if (onboardingStep === 'PORTFOLIO') {
        router.toFreelancerOnboardingPortfolio(ctx);
      } else {
        router.toFreelancerOnboardingPersonal(ctx);
      }
      // => Do not go for early return, as we need to pass user down as props
    }

    let componentProps = {};
    if (WrappedComponent.getInitialProps) {
      componentProps = await WrappedComponent.getInitialProps(ctx);
    }

    const { authenticatedUser } = res.data;

    return {
      ...componentProps,
      authenticatedUser,
      token,
    };
  };

  return Wrapper;
};

export default withAuthSync;
