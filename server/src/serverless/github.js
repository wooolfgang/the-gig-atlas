/* eslint-disable camelcase */
import axios from 'axios';
import config from '../config';

const { id, secret, redirectURI } = config.githubOauth;

const scopes = ['read:user', 'user:email'].join(' ');

function getConnectionURL() {
  return `https://github.com/login/oauth/authorize?client_id=${id}&redirect_uri=${redirectURI}&scope=${scopes}`;
}

async function getUserData(code) {
  //
  // => query token by code
  const url = `https://github.com/login/oauth/access_token?client_id=${id}&client_secret=${secret}&code=${code}`;
  const res = await axios.post(
    url,
    {},
    { headers: { Accept: 'application/json' } },
  );

  // => query user data
  const userUrl = 'https://api.github.com/user';
  const { access_token } = res.data;
  const { data } = await axios.get(userUrl, {
    headers: {
      Authorization: `token ${access_token}`,
      Accept: 'application/json',
    },
  });

  const { email, name, id: userId, avatar_url } = data;

  return {
    email,
    name,
    id: userId,
    firstName: '',
    lastName: '',
    imageUrl: avatar_url,
  };
}

export default {
  getConnectionURL,
  getUserData,
};

// [ref]=> https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
// [scopers ref]=> https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
