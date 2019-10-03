import React from 'react';
import { Formik, Form, Field } from 'formik';
import { setCookie } from 'nookies';
import { useMutation } from '@apollo/react-hooks';
import { SIGNUP_LOCAL } from '../../graphql/auth';
import CustomField from '../CustomField';
import router from '../../utils/router';

const SignupLocal = () => {
  const [signup] = useMutation(SIGNUP_LOCAL, {
    onCompleted: data => {
      /**
       * @todo: set as secure
       */
      setCookie({}, 'token', data.token);
      router.toProfile();
    },
    // onError: err => {
    //   console.log(err.message);
    //   console.log(err.graphQLErrors);
    //   console.log('apollo err: ', err);
    // },
  });

  return (
    <>
      <Formik
        onSubmit={async (values, actions) => {
          await signup({ variables: { input: values } });
          actions.setSubmitting(false);
        }}
        render={({ isSubmitting }) => (
          <Form>
            <h4>Basic details</h4>
            <Field
              type="text"
              name="firstName"
              label="First name"
              component={CustomField}
            />
            <Field
              type="text"
              name="lastName"
              label="Last Name"
              component={CustomField}
            />
            <h4>Credentials</h4>
            <Field
              type="email"
              name="email"
              label="Email"
              component={CustomField}
            />
            <Field
              type="password"
              name="password"
              label="Password"
              component={CustomField}
            />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      />
    </>
  );
};

export default SignupLocal;
