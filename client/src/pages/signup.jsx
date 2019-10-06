import React from 'react';
import styled from 'styled-components';
import common from '@shared/common';
import { Formik, Field, Form } from 'formik';
import NavLoginSignup from '../components/NavLoginSignup';
import HTMLHead from '../components/HTMLHead';
import Button from '../primitives/Button';
import CustomField from '../components/CustomField';

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
  box-sizing: border-box;
`;

const Signup = () => (
  <>
    <HTMLHead />
    <NavLoginSignup />
    <Body>
      <h1 style={{ margin: '1.875rem 0 0px 0' }}> Sign Up</h1>
      <p>
        Be the first to join a great community of passionate freelancers, land
        oppurtunities.
      </p>
      <Card>
        <Button
          style={{
            backgroundColor: '#4285F4',
            color: 'white',
            marginBottom: '12px',
          }}
        >
          Signup With Google
        </Button>
        <Button style={{ backgroundColor: '#24292e', color: 'white' }}>
          Signup With Github
        </Button>
        <div style={{ padding: '20px 0', fontSize: '.9rem', opacity: 0.75 }}>
          or signup with email...
        </div>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={common.validation.signupInput}
          onSubmit={() => {}}
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
                Signup With Email
              </Button>
            </Form>
          )}
        />
      </Card>
      <p>By joining, you agree to our Terms of Service and Privacy Policy</p>
    </Body>
  </>
);

export default Signup;
