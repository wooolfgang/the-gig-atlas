import axios from 'axios';
import config from '../src/config';

const { id, secret, redirectURI } = config.githubOAuth;

const scopes = ['read:user', 'read:email'].join(' ');

function getConnectionURL() {
  return `https://github.com/login/oauth/authorize?client_id=${id}&redirect_uri=${redirectURI}&scope=${scopes}`;
}

async function getUserData(code) {
  const url = `https://github.com/login/oauth/access_token?client_id=${id}&client_secret=${secret}&code=${code}`;
  const res = await axios.post(
    url,
    {},
    { headers: { Accept: 'application/json' } },
  );

  console.log('github token response', res.data);

  const userUrl = 'https://api.github.com/user';
  const user = await axios.get(
    userUrl,
    {},
    { headers: { Authorization: `token ${res.data.token}` } },
  );

  console.log('github user', user);
}

// [ref]=> https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
// [ref]=> https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
