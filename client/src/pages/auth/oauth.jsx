/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { OAUTH } from '../../graphql/auth';
// import { useRouter } from 'next/router';

/**
 * Popup window for processing OAuth code from providers
 * This windows sends authentication result to the parent window
 * @param {Object} props
 * @param {String} props.id user's id
 * @param {String} token user's new token
 */
const OAuth = ({ oauth, errors }) => {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'oauth', oauth, errors },
        window.location.origin,
      );

      window.close();
    }
  });

  return <div />;
};

OAuth.getInitialProps = async ({ query, apolloClient }) => {
  // const res = await apolloClient.mutation();'
  // console.log('from popup auth: ');
  // console.log('query value: ', query);
  // console.log('code: ', query.code);
  // console.log('headers', req.headers);
  const oauthInput = {
    code: query.code,
  };
  try {
    const res = await apolloClient.mutate({
      mutation: OAUTH,
      variables: { input: oauthInput },
    });
    // console.log('res of auth: ', res);

    const {
      data: { oauth },
      errors,
    } = res;

    return { oauth, errors };
  } catch (e) {
    console.log('errors of auth: ', e);
    return { errors: e };
  }
};

export default OAuth;
