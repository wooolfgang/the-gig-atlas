import React, { useEffect } from 'react';
import router from '../../utils/router';
import { CHECK_VALID_TOKEN } from '../../graphql/auth';

const withAuthSync = WrappedComponent => {
  /**
   * Authentication Page wrapper
   * @param {Object} props
   * @param {Object} props.client
   */
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!');
        router.toSignin();
      }
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);
      console.log('used effect synch logout');
      return () => {
        console.log('used effect sync logout 2');
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, [null]);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async ctx => {
    console.log('EXECUTED HERE in...');
    /**
     * Authenticate Component with valid token
     */
    const { token, apolloClient, req } = ctx;
    const res = await apolloClient.query({
      query: CHECK_VALID_TOKEN,
    });

    if (req && !res.data.checkValidToken) {
      ctx.res.writeHead(302, { Location: '/auth/signin' });
      ctx.res.end();
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
