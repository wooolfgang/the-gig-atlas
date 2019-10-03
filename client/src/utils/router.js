import Router from 'next/router';

const toSignin = () => {
  Router.push('/auth/signin');
};

const toSignup = () => {
  Router.push('/auth/signup');
};

const toProfile = () => {
  Router.push('/profile');
};

export default {
  toSignin,
  toSignup,
  toProfile,
};
