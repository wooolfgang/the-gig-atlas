/* eslint-disable import/no-named-as-default-member */
import React, { useEffect } from 'react';
import router from '../../utils/router';
import { CHECK_VALID_TOKEN } from '../../graphql/auth';
import auth from '../../utils/auth';

const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    // => set logout details on local storage after trigger user logout (auth.logout)
    const syncLogout = event => {
      if (event.key === 'logout') {
        router.toSignin();
      }
    };
    useEffect(() => {
      // => set log effects
      window.logout = () => {
        auth.logout();
        router.toSignin();
      };
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
    console.log('=> from WithAuthSync');
    const { apolloClient } = ctx;
    const token = auth.getToken(ctx);
    console.log('the token: ', token);

    if (!token) {
      router.toSignin(ctx);
      console.log('no token redirect to signin');

      return {};
    }

    const res = await apolloClient.query({
      query: CHECK_VALID_TOKEN,
    });

    console.log('res data', res.data);

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
