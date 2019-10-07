/* eslint-disable react/prop-types */
import React from 'react';
// import { useMutation } from '@apollo/react-hooks';
import FormSignin from '../../components/FormSignin';
import withNoAuth from '../../components/withNoAuthSync';
import AuthProvider from '../../components/AuthProvider';
import { OAUTH_URL } from '../../graphql/auth';

const Signin = ({ oauthURL }) => (
  <>
    <FormSignin />
    <AuthProvider oauthURL={oauthURL} />
  </>
);

Signin.getInitialProps = async ctx => {
  const { apolloClient } = ctx;

  const {
    data: { oauthURL },
  } = await apolloClient.query({
    query: OAUTH_URL,
  });

  return { oauthURL };
};
// => set no auth for this page
export default withNoAuth(Signin);
