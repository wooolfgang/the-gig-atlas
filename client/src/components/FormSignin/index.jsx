import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import common from '@shared/common';
import { LOGIN_LOCAL } from '../../graphql/auth';
import router from '../../utils/router';
import auth from '../../utils/auth';
import { Button } from '../../primitives';
import CustomField from '../CustomField';
import ErrorBanner from '../../primitives/ErrorBanner';

const SigninLocal = () => {
  const [error, setError] = useState(null);
  const [login] = useMutation(LOGIN_LOCAL, {
    onCompleted: data => {
      auth.setTokenCookie(data.login.token);
      router.toProfile();
    },
  });

  return (
    <>
      <Formik
        onSubmit={async (values, actions) => {
          try {
            await login({ variables: values });
            actions.setSubmitting(true);
          } catch (e) {
            setError(e);
            actions.setSubmitting(false);
          }
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
                styleType="primary"
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Continue With Email'}
              </Button>
            </Form>
          </Form>
        )}
      />
    </>
  );
};

export default SigninLocal;
