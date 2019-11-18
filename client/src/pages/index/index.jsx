import React from 'react';
import PropTypes from 'prop-types';
import Authenticated from './authenticated';
import Landing from './landing';
import auth from '../../utils/auth';
import router from '../../utils/router';
import { GET_AUTHENTICATED_USER } from '../../graphql/auth';

const Index = ({ authenticatedUser }) => {
  if (authenticatedUser) {
    return <Authenticated authenticatedUser={authenticatedUser} />;
  }
  return <Landing />;
};

Index.propTypes = {
  authenticatedUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }),
};

Index.defaultProps = {
  authenticatedUser: null,
};

Index.getInitialProps = async ctx => {
  const { apolloClient } = ctx;
  const token = auth.getToken(ctx);

  if (token) {
    const res = await apolloClient.query({
      query: GET_AUTHENTICATED_USER,
      fetchPolicy: 'network-only',
    });

    if (res.data.authenticatedUser) {
      const { authenticatedUser } = res.data;

      if (authenticatedUser.onboardingStep === 'PERSONAL') {
        router.toPersonalOnboarding(ctx);
      } else if (authenticatedUser.onboardingStep === 'EMPLOYER') {
        router.toEmployerOnboarding(ctx);
      } else if (authenticatedUser.onboardingStep === 'FREELANCER') {
        router.toFreelancerOnboarding(ctx);
      }

      return {
        authenticatedUser: res.data.authenticatedUser,
      };
    }
  }

  return {};
};

export default Index;
