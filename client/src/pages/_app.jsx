import React from 'react';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';
import withApollo from '../components/withApollo';
import theme from '../utils/theme';
import GlobalStyle from '../utils/globalStyle';

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
          <style jsx global>
            {`
              @import url('https://rsms.me/inter/inter.css');
              html {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont,
                  Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji,
                  Segoe UI Emoji, Segoe UI Symbol;
              }
              @supports (font-variation-settings: normal) {
                html {
                  font-family: 'Inter var', -apple-system, BlinkMacSystemFont,
                    Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji,
                    Segoe UI Emoji, Segoe UI Symbol;
                }
              }
            `}
          </style>
          <GlobalStyle />
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      );
    }
  }
);
