import React from 'react';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import { useMutation } from '@apollo/react-hooks';
import auth from '../../utils/auth';
import { SIGNUP_LOCAL } from '../../graphql/auth';
import CustomField from '../CustomField';
import router from '../../utils/router';
import Button from '../../primitives/Button';
import ErrorBanner from '../../primitives/ErrorBanner';

const SignupLocal = () => {
  const [signup, { error }] = useMutation(SIGNUP_LOCAL, {
    onCompleted: data => {
      auth.setTokenCookie(data.signup.token);
      router.toFreelancerOnboardingPersonal();
    },
  });

  return (
    <>
      <Formik
        onSubmit={async (values, actions) => {
          try {
            console.log('these are the values', values);
            await signup({ variables: { input: values } });
          } catch (e) {
            /**
             * @todo: handle error
             */
            console.error(e);
          }
          actions.setSubmitting(false);
        }}
        initialValues={{
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        }}
        validationSchema={common.validation.signupInput}
        render={({ isSubmitting }) => (
          <Form>
            {error && (
              <ErrorBanner error={error} style={{ marginBottom: '1rem' }} />
            )}
            <Field
              name="firstName"
              type="text"
              label="First Name"
              labelStyle={{ marginBottom: '.6rem' }}
              component={CustomField}
            />
            <Field
              name="lastName"
              type="text"
              label="Last Name"
              labelStyle={{ marginBottom: '.6rem' }}
              component={CustomField}
            />
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
            <Button
              style={{ marginTop: '.8rem' }}
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Signing up...' : 'Signup With Email'}
            </Button>
          </Form>
        )}
      />
    </>
  );
};

export default SignupLocal;
