import React from 'react';
import styled from 'styled-components';
import common from '@shared/common';
import { Formik, Field, Form } from 'formik';
import NavLoginSignup from '../components/NavLoginSignup';
import HTMLHead from '../components/HTMLHead';
import LoginIllustrationAnimated from '../components/LoginIllustrationAnimated';
import CustomField from '../components/CustomField';
import Button from '../primitives/Button';
import { color } from '../utils/theme';

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

const Login = () => (
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
        <span style={{ fontWeight: '600', color: color.s2 }}> community </span>
        of freelancers around the globe.
      </p>
      <Card>
        <Button
          style={{
            backgroundColor: '#4285F4',
            color: 'white',
            marginBottom: '12px',
          }}
        >
          Continue With Google
        </Button>
        <Button style={{ backgroundColor: '#24292e', color: 'white' }}>
          Continue With Github
        </Button>
        <div style={{ padding: '20px 0', fontSize: '.9rem', opacity: 0.75 }}>
          or continue with email...
        </div>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={common.validation.signinInput}
          onSubmit={e => {
            e.preventDefault();
          }}
          render={() => (
            <Form>
              <Field
                name="email"
                type="text"
                label="Email"
                labelStyle={{ marginBottom: '.6rem' }}
                component={CustomField}
              />
              <Field
                name="password"
                type="password"
                label="Password"
                component={CustomField}
              />
              <Button style={{ marginTop: '.8rem' }} type="submit">
                Continue With Email
              </Button>
            </Form>
          )}
        />
      </Card>
    </Body>
  </Container>
);

export default Login;
