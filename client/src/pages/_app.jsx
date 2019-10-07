import React from 'react';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';
import MobileDetect from 'mobile-detect';
import withApollo from '../components/withApollo';
import theme from '../utils/theme';
import GlobalStyle from '../utils/globalStyle';
import { MediaProvider } from '../components/MediaProvider';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    let isMobile;
    if (ctx && ctx.req) {
      const md = new MobileDetect(ctx.req.headers['user-agent']);
      isMobile = !!md.mobile();
    }

    return { pageProps, isMobile };
  }

  render() {
    const { Component, pageProps, apolloClient, isMobile } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <style jsx global>
          {`
            @import url('https://rsms.me/inter/inter.css');
            html {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI,
                Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
                Segoe UI Symbol;
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
          <MediaProvider value={{ isMobile }}>
            <Component {...pageProps} />
          </MediaProvider>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
