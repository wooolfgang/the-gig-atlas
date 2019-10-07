import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import common from '@shared/common';
import { LOGIN_LOCAL } from '../../graphql/auth';
import router from '../../utils/router';
import auth from '../../utils/auth';
import Button from '../../primitives/Button';
import CustomField from '../CustomField';
import ErrorBanner from '../../primitives/ErrorBanner';

const SigninLocal = () => {
  const [login, { error }] = useMutation(LOGIN_LOCAL, {
    onCompleted: data => {
      auth.setTokenCookie(data.login.token);
      router.toProfile();
    },
    onError: err => {
      console.log('error login: ', err.message);
    },
  });

  return (
    <>
      <Formik
        onSubmit={async (values, actions) => {
          await login({ variables: values });
          actions.setSubmitting(false);
        }}
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={common.validation.signinInput}
        render={({ isSubmitting }) => (
          <Form>
            <Form>
              {error && (
                <ErrorBanner error={error} style={{ marginBottom: '1rem' }} />
              )}
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
                {isSubmitting ? 'Submitting... ' : 'Continue With Email'}
              </Button>
            </Form>
          </Form>
        )}
      />
    </>
  );
};

export default SigninLocal;
