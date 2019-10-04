import React, { useEffect } from 'react';
import router from '../../utils/router';
import { CHECK_VALID_TOKEN } from '../../graphql/auth';

const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === 'logout') {
        router.toSignin();
      }
    };
    useEffect(() => {
      // => set log effects
      window.addEventListener('storage', syncLogout);
      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, [null]);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async ctx => {
    // => Authenticates Component with valid token

    const { token, apolloClient } = ctx;

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
