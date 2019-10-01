import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const SigninLocal = () => (
  <>
    <Formik
      onSubmit={(values, actions) => {}}
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

export default SigninLocal;
