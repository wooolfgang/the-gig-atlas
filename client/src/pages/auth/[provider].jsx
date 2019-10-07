/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { OAUTH } from '../../graphql/auth';
import auth from '../../utils/auth';
// import { useRouter } from 'next/router';

/**
 * Popup window for processing OAuth code from providers
 * This windows sends authentication result to the parent window
 * @param {Object} props
 * @param {String} props.oauth sucessfull authenticatoin data
 * @param {String} errors failed authenticatoin data
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

OAuth.getInitialProps = async ctx => {
  const {
    query: { provider, code, state },
    apolloClient,
  } = ctx;
  const cookieState = auth.getState(ctx);
  auth.removeStateCookie(ctx);

  if (state !== cookieState) {
    // => cancel on CSRF attack
    return { errors: new Error('Invalid OAuth state') };
  }

  try {
    const oauthInput = {
      code,
      provider,
    };

    const res = await apolloClient.mutate({
      mutation: OAUTH,
      variables: { input: oauthInput },
    });

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
