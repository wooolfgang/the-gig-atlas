import { ApolloClient, InMemoryCache } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { createUploadLink as CreateUploadLink } from 'apollo-upload-client';
import getConfig from 'next/config';
import { persistCache } from 'apollo-cache-persist';

const { publicRuntimeConfig } = getConfig();

let apolloClient = null;
const isServer = typeof window === 'undefined';

const endpoint = publicRuntimeConfig.serverUri;
// Polyfill fetch() on the server (used by apollo-client)
if (isServer) {
  global.fetch = fetch;
}

function create(initialState, { getToken }) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const token = getToken();
  const cache = new InMemoryCache().restore(initialState);
  if (!isServer) {
    persistCache({
      cache,
      storage: window && window.localStorage,
    });
  }

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: isServer, // Disables forceFetch on the server (so queries are only run once)
    link: new CreateUploadLink({
      uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint, // Server URL (must be absolute)
      credentials: 'include',
      headers: { authorization: token },
    }),
    cache,
    resolvers: {},
  });
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)

  if (isServer) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
