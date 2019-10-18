/* eslint-disable import/no-named-as-default-member */
import { ApolloClient, InMemoryCache, ApolloLink, concat } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { createUploadLink as CreateUploadLink } from 'apollo-upload-client';
import getConfig from 'next/config';
import { persistCache } from 'apollo-cache-persist';
import auth from './auth';

const { publicRuntimeConfig } = getConfig();
const isServer = typeof window === 'undefined';
let apolloClient = null;

// const endpoint = publicRuntimeConfig.uriServerGql;
// => Polyfill fetch() on the server (used by apollo-client)
if (isServer) {
  global.fetch = fetch;
}

function create(initialState, ctx) {
  // => Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const cache = new InMemoryCache().restore(initialState);
  if (!isServer) {
    persistCache({
      cache,
      storage: window && window.localStorage,
    });
  }

  const authMiddeware = new ApolloLink((operation, next) => {
    // => handles post process authentication before every server request
    const token = auth.getToken(ctx);
    operation.setContext({
      headers: {
        authorization: token,
      },
    });

    return next(operation);
  });
  const uploadLink = new CreateUploadLink({
    uri: publicRuntimeConfig.gqlServer, // [info]=> Server URL (must be absolute)
    credentials: 'include',
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    link: concat(authMiddeware, uploadLink),
    ssrMode: isServer, // [info]=> Disables forceFetch on the server (so queries are only run once)
    cache,
    resolvers: {},
  });
}

/**
 * Create or retrieve apollo client
 * @param {Object} initialState
 * @param {Object} ctx provide context to for server or browser
 */
export default function initApollo(initialState, ctx) {
  // => Make sure to create a new client for every server-side request so that data
  // => isn't shared between connections (which would be bad)
  // [ref]=> https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/apollo.js
  if (isServer) {
    return create(initialState, ctx);
  }

  if (!apolloClient) {
    // => browser side client
    apolloClient = create(initialState, ctx);
  }

  return apolloClient;
}
