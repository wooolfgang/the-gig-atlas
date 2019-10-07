/* eslint-disable import/no-named-as-default-member */
import React, { useEffect } from 'react';
import router from '../../utils/router';
import { CHECK_VALID_TOKEN } from '../../graphql/auth';
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
    }, [null]);

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
      query: CHECK_VALID_TOKEN,
    });

    if (!res.data.checkValidToken) {
      router.toSignin(ctx);

      return {};
    }

    let componentProps = {};
    if (WrappedComponent.getInitialProps) {
      componentProps = await WrappedComponent.getInitialProps(ctx);
    }

    return { ...componentProps, token };
  };

  return Wrapper;
};

export default withAuthSync;
