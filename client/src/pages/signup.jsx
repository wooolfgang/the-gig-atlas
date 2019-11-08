import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import withNoAuth from '../components/withNoAuthSync';
import FormSignup from '../components/FormSignup';
import Nav from '../components/Nav';
import HTMLHead from '../components/HTMLHead';
import AuthProvider from '../components/AuthProvider';
import { OAUTH_URL } from '../graphql/auth';

const Card = styled.div`
  margin-top: 15px;
  width: 400px;
  max-width: 100vw;
  background: ${props => props.theme.color.d6};
  box-shadow: 0px 2px 40px ${props => props.theme.color.d4};
  border-radius: 2px;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 2rem;
  padding-bottom: 1.2rem;
  box-sizing: border-box;
`;

const Signup = ({ oauthURL }) => (
  <>
    <HTMLHead />
    <Nav type="LOGIN_SIGNUP" />
    <Body>
      <h1 style={{ margin: '1.875rem 0 0px 0' }}> Sign Up</h1>
      <p>
        Be the first to join a great community of passionate freelancers, land
        oppurtunities.
      </p>
      <Card>
        <AuthProvider oauthURL={oauthURL} />
        <div style={{ padding: '20px 0', fontSize: '.9rem', opacity: 0.75 }}>
          or signup with email...
        </div>
        <FormSignup />
      </Card>
      <p>By joining, you agree to our Terms of Service and Privacy Policy</p>
    </Body>
  </>
);

Signup.propTypes = {
  oauthURL: PropTypes.shape({
    github: PropTypes.string,
    google: PropTypes.string,
  }).isRequired,
};

Signup.getInitialProps = async ctx => {
  const { apolloClient } = ctx;

  const {
    data: { oauthURL },
  } = await apolloClient.query({
    query: OAUTH_URL,
  });

  return { oauthURL };
};

// => set no auth for this page
export default withNoAuth(Signup);
