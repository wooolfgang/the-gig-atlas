import React from 'react';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import withApollo from '../components/withApollo';

export default withApollo(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      let pageProps = {};
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      return { pageProps };
    }

    render() {
      const { Component, pageProps, apolloClient } = this.props;
      return (
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      );
    }
  }
);
