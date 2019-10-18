/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';
import { getDataFromTree } from '@apollo/react-ssr';
import initApollo from '../../utils/apollo';

const isServer = typeof window === 'undefined';

export default App => {
  const WithApollo = ({ apolloClient, apolloState, ...props }) => {
    const client = apolloClient || initApollo(apolloState);

    return <App {...props} apolloClient={client} />;
  };

  if (process.env.NODE_ENV !== 'production') {
    // => Set the correct displayName in development
    const displayName = App.displayName || App.name || 'Component';

    if (displayName === 'App') {
      // eslint-disable-next-line no-console
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }
  if (isServer) {
    WithApollo.getInitialProps = async ctx => {
      const {
        Component,
        router,
        ctx: { res },
      } = ctx;

      const apollo = initApollo({}, ctx.ctx);

      ctx.ctx.apolloClient = apollo;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      if (res && res.finished) {
        // console.log('on finished');
        return appProps;
      }

      if (!process.browser) {
        // => Run all graphql queries in the component tree
        // => and extract the resulting data
        try {
          // => Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />,
          );
        } catch (error) {
          // => Prevent Apollo Client GraphQL errors from crashing SSR.
          // => Handle them in components via the data.error prop:
          // [ref]=> https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          // eslint-disable-next-line no-console
          console.error('Error while running `getDataFromTree`', error);
        }

        // => getDataFromTree does not call componentWillUnmount
        // => head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // => Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    };
  }

  return WithApollo;
};
