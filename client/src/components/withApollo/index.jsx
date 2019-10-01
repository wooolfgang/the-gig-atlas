import React from 'react';
import Head from 'next/head';
import { getDataFromTree } from '@apollo/react-ssr';
import nookies from 'nookies';
import initApollo from '../../utils/apollo';

export default (App, { ssr = true } = {}) => {
  const WithApollo = ({ apolloClient, apolloState, ...props }) => {
    const client =
      apolloClient ||
      initApollo(apolloState, {
        getToken: () => props.token,
      });
    return <App {...props} apolloClient={client} />;
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = App.displayName || App.name || 'Component';

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || App.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const {
        Component,
        router,
        ctx: { req, res },
      } = ctx;

      const token = req
        ? nookies.get(ctx.ctx).token
        : document.cookie.split('=')[1];

      const apollo = initApollo(
        {},
        {
          getToken: () => token,
        },
      );

      ctx.ctx.apolloClient = apollo;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};
      }

      if (!process.browser) {
        // Run all graphql queries in the component tree
        // and extract the resulting data
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />,
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
        token,
      };
    };
  }

  return WithApollo;
};
