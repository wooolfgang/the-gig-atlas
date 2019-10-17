import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withNoAuth from '../components/withNoAuthSync';
import AuthProvider from '../components/AuthProvider';
import { OAUTH_URL } from '../graphql/auth';
import NavLoginSignup from '../components/NavLoginSignup';
import HTMLHead from '../components/HTMLHead';
import LoginIllustrationAnimated from '../components/LoginIllustrationAnimated';
import { color } from '../utils/theme';
import FormSignin from '../components/FormSignin';

const Container = styled.div`
  background: ${props => props.theme.color.d5};
  min-height: 100vh;
`;

const Body = styled.div`
  background: ${props => props.theme.color.d5};
  width: 100vw;
  margin-top: -6.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 3.125rem 2rem 3.125rem 2rem;
`;

const IllustrationContainer = styled.div`
  margin-top: -2rem;
`;

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

const Signin = ({ oauthURL }) => (
  <>
    <Container>
      <HTMLHead />
      <NavLoginSignup />
      <IllustrationContainer>
        <LoginIllustrationAnimated width={150} height={150} />
      </IllustrationContainer>
      <Body>
        <h1 style={{ margin: '1.875rem 0 0px 0' }}> Login to The Gig Atlas</h1>
        <p>
          Interact with an awesome
          <span style={{ fontWeight: '600', color: color.s2 }}>
            {' '}
            community{' '}
          </span>
          of freelancers around the globe.
        </p>
        <Card>
          <AuthProvider oauthURL={oauthURL} />
          <div style={{ padding: '20px 0', fontSize: '.9rem', opacity: 0.75 }}>
            or continue with email...
          </div>
          <FormSignin />
        </Card>
      </Body>
    </Container>
  </>
);

Signin.propTypes = {
  oauthURL: PropTypes.shape({
    github: PropTypes.string,
    google: PropTypes.string,
  }).isRequired,
};

Signin.getInitialProps = async ctx => {
  const { apolloClient } = ctx;

  const {
    data: { oauthURL },
  } = await apolloClient.query({
    query: OAUTH_URL,
  });

  return { oauthURL };
};
// => set no auth for this page
export default withNoAuth(Signin);
