import React from 'react';
// import { useMutation } from '@apollo/react-hooks';
import FormSignin from '../../components/FormSignin';
import withNoAuth from '../../components/withNoAuthSync';
import AuthProvider from '../../components/AuthProvider';
import { GOOGLE_URL } from '../../graphql/auth';

const Signin = ({ googleURL }) => (
  <>
    <FormSignin />
    <AuthProvider googleURL={googleURL} />
  </>
);

Signin.getInitialProps = async ctx => {
  const { apolloClient } = ctx;

  const res = await apolloClient.query({
    query: GOOGLE_URL,
  });

  return {
    googleURL: res.data.googleOAuthURL,
  };
};
// => set no auth for this page
export default withNoAuth(Signin);
