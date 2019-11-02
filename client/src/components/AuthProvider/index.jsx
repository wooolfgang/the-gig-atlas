/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import auth from '../../utils/auth';
import router from '../../utils/router';
import Button from '../../primitives/Button';

/**
 * Creates and open a new window popup for handling OAuth from providers
 * @param {String} url provider oauth url
 * @param {String} name window name
 * @param {Function} handler handles popup window event
 */
const openPopup = (url, name, handler) => {
  const width = 500;
  const height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  const windowOpts = `
    toolbar=no, location=no, directories=no, status=no, menubar=no, 
    scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
    height=${height}, top=${top}, left=${left}
  `;

  const openWindow = window.open(url, name, windowOpts);

  window.addEventListener('message', handler);

  return openWindow;
};

/**
 *  Holds Providers authentication
 * @param {Object} props
 * @param {Object} props.oauthURL object contains providers URL
 * @param {String} props.oauthURL.google google oauth URL
 * @param {String} props.oauthURL.github github oauth URL
 *
 */
const AuthProvider = ({ oauthURL }) => {
  const [isSigning, setSigning] = useState(false);
  let checkWindowClose;

  const oauthRsultHandler = event => {
    // => set msg from popup window to handle
    if (!event.data || event.data.type !== 'oauth') {
      return;
    }

    // => cleanup
    setSigning(false);
    auth.removeStateCookie();
    window.removeEventListener('message', oauthRsultHandler);
    clearInterval(checkWindowClose);

    // => Handle result from authentication
    const { oauth, errors } = event.data;
    if (oauth) {
      auth.setTokenCookie(oauth.token);
      router.toProfile();
    } else {
      /**
       * @TODO handle error received upon failed authnetication
       */
      console.log('received errors: ', errors);
    }
  };

  const startAuth = (url, name) => e => {
    e.preventDefault();

    const stateURl = auth.setOauthState(url);
    const popup = openPopup(stateURl, name, oauthRsultHandler);
    checkWindowClose = setInterval(() => {
      // => check window close state every 1/2 seconds for cleanup
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(checkWindowClose);
        setSigning(false);
      }
    }, 500);

    setSigning(true);
  };

  return (
    <>
      <Button
        onClick={startAuth(oauthURL.google, 'Google OAuth')}
        disabled={isSigning}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          marginBottom: '12px',
        }}
      >
        Continue With Google
      </Button>
      <Button
        onClick={startAuth(oauthURL.github, 'Github OAuth')}
        disabled={isSigning}
        style={{ backgroundColor: '#24292e', color: 'white' }}
      >
        Continue With Github
      </Button>
    </>
  );
};

export default AuthProvider;

// [reference]=> https://codeburst.io/react-authentication-with-twitter-google-facebook-and-github-862d59583105
// [reference] => https://blog.leavemealone.app/how-to-oauth-popup/
// [reference] => https://gist.github.com/gauravtiwari/2ae9f44aee281c759fe5a66d5c2721a2
