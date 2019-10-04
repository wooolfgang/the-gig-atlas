import React from 'react';
import router from '../../utils/router';
import { CHECK_VALID_TOKEN } from '../../graphql/auth';

const withNoAuthSync = WrappedComponent => {
  const Wrapper = props => <WrappedComponent {...props} />;

  Wrapper.getInitialProps = async ctx => {
    // => Checks Token validity
    const { token, apolloClient } = ctx;

    if (token) {
      // => disallow user with valid token
      const res = await apolloClient.query({
        query: CHECK_VALID_TOKEN,
      });

      if (res.data.checkValidToken === true) {
        router.toProfile(ctx);

        return {};
      }
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
