/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import auth from '../../utils/auth';
import router from '../../utils/router';

const openPopup = (url, name, handler) => {
  const width = 600;
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
 * @param {String} props.googleURL google OAuthURL redirection
 */
const AuthProvider = ({ googleURL }) => {
  let msgHandler;

  const [isSigning, setSigning] = useState(false);
  const startAuth = (url, name) => e => {
    if (!isSigning) {
      const stateURl = auth.setOauthState(url);

      msgHandler = event => {
        // => set msg from popup window to handle
        if (!event.data || event.data.type !== 'oauth') {
          return;
        }

        setSigning(false);
        window.removeEventListener('message', msgHandler);

        const { oauth, errors } = event.data;
        if (oauth) {
          auth.setTokenCookie(oauth.token);
          router.toProfile();
        } else {
          console.log('received errors: ', errors);
        }
      };

      e.preventDefault();
      openPopup(stateURl, name, msgHandler);
      setSigning(true);
    }
  };

  return (
    <div>
      <button
        onClick={startAuth(googleURL, 'Google OAuth')}
        disabled={isSigning}
      >
        Google
      </button>
    </div>
  );
};

export default AuthProvider;

// [reference]=> https://codeburst.io/react-authentication-with-twitter-google-facebook-and-github-862d59583105
// [reference] => https://blog.leavemealone.app/how-to-oauth-popup/
// [reference] => https://gist.github.com/gauravtiwari/2ae9f44aee281c759fe5a66d5c2721a2
