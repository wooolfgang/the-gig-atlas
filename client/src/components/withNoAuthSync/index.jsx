import React from 'react';
import router from '../../utils/router';
import { GET_AUTHENTICATED_USER } from '../../graphql/auth';
import auth from '../../utils/auth';

/**
 * Wrapped component that must not be rendered from authenticated user
 * @param {React.Component} WrappedComponent React component to be wrapped
 */
const withNoAuthSync = WrappedComponent => {
  const Wrapper = props => <WrappedComponent {...props} />;

  Wrapper.getInitialProps = async ctx => {
    // => Checks Token validity
    const { apolloClient } = ctx;
    const token = auth.getToken(ctx);

    if (token) {
      // => disallow user with valid token
      const res = await apolloClient.query({
        query: GET_AUTHENTICATED_USER,
        // => Make sure to always fetch network first, as apollo defaults to cache
        fetchPolicy: 'network-only',
      });

      if (res.data.authenticatedUser) {
        // => redirect to profile if user is authenticated
        router.toIndex(ctx);
        return {
          authenticatedUser: res.data.authenticatedUser,
        };
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
