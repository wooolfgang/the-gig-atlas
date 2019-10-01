import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const SignupLocal = () => (
  <>
    <Formik
      onSubmit={(values, actions) => {}}
      render={({ isSubmitting }) => (
        <Form>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    />
  </>
);

export default SignupLocal;
