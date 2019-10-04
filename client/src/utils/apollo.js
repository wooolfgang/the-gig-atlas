/* eslint-disable import/no-named-as-default-member */
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { createUploadLink as CreateUploadLink } from 'apollo-upload-client';
import getConfig from 'next/config';
import { persistCache } from 'apollo-cache-persist';
import auth from './auth';

const { publicRuntimeConfig } = getConfig();

const apolloClient = null;
const isServer = typeof window === 'undefined';

const endpoint = publicRuntimeConfig.uriServerGql;
// Polyfill fetch() on the server (used by apollo-client)
if (isServer) {
  global.fetch = fetch;
}

function create(initialState, ctx) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  // const token = getToken();
  const cache = new InMemoryCache().restore(initialState);
  if (!isServer) {
    persistCache({
      cache,
      storage: window && window.localStorage,
    });
  }

  console.log('=> apollo client create: ');
  const token = auth.getToken(ctx);
  console.log('apollo token: ', token);

  const request = operation => {
    console.log('from client fetch', operation);
  };

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: isServer, // Disables forceFetch on the server (so queries are only run once)
    link: new CreateUploadLink({
      uri: endpoint, // Server URL (must be absolute)
      credentials: 'include',
      headers: { authorization: token }, // remove temporarily
      request,
    }),
    cache,
    resolvers: {},
    request,
  });
}

/**
 * Create or retrieve apollo client
 * @param {Object} initialState
 * @param {Object} ctx
 */
export default function initApollo(initialState, ctx = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)

  // if (isServer) {
  //   return create(initialState, ctx);
  // }

  // if (!apolloClient) {
  //   apolloClient = create(initialState, ctx);
  // }
  return create(initialState, ctx);
  // return apolloClient;
}
