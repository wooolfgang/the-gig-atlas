/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_LOCAL } from '../../graphql/auth';
import router from '../../utils/router';
import auth from '../../utils/auth';

const SigninLocal = () => {
  const [login] = useMutation(LOGIN_LOCAL, {
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
        render={({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      />
    </>
  );
};

export default SigninLocal;
