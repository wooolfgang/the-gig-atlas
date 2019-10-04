import React, { useEffect } from 'react';
import router from '../../utils/router';
import { CHECK_VALID_TOKEN } from '../../graphql/auth';

const withNoAuthSync = WrappedComponent => {
  /**
   * Authentication Page wrapper
   * @param {Object} props
   * @param {Object} props.client
   */
  const Wrapper = props => {

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async ctx => {
    /**
     * Authenticate Component with valid token
     */
    const { token, apolloClient, req } = ctx;
    const res = await apolloClient.query({
      query: CHECK_VALID_TOKEN,
    });

    if (req && !res.data.checkValidToken) {
      // server check
      ctx.res.writeHead(302, { Location: '/auth/signin' });
      ctx.res.end();
    } else if (!res.data.checkValidToken) {
      // browser check
      router.toSignin();
    }

    let componentProps = {};
    if (WrappedComponent.getInitialProps) {
      componentProps = await WrappedComponent.getInitialProps(ctx);
    }

    return { ...componentProps, token };
  };

  return Wrapper;
};

export default withNoAuthSync;
