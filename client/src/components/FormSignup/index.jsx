import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import { useMutation } from '@apollo/react-hooks';
import auth from '../../utils/auth';
import { SIGNUP_LOCAL } from '../../graphql/auth';
import CustomField from '../CustomField';
import router from '../../utils/router';
import { Button } from '../../primitives';
import ErrorBanner from '../../primitives/ErrorBanner';

const SignupLocal = () => {
  const [error, setError] = useState(null);
  const [signup] = useMutation(SIGNUP_LOCAL, { onError: setError });

  return (
    <>
      <Formik
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          try {
            const { errors, data } = await await signup({
              variables: { input: values },
            });
            if (errors) {
              throw errors;
            }

            auth.setTokenCookie(data.signup.token);
            if (values.accountType === 'FREELANCER') {
              router.toFreelancerOnboarding();
            } else if (values.accountType === 'EMPLOYER') {
              router.toEmployerOnboarding();
            }
          } catch (e) {
            /**
             * @todo: handle error
             */
            setError(e);
          }
          actions.setSubmitting(false);
        }}
        initialValues={{
          accountType: '',
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
              name="accountType"
              type="select"
              label="Account type"
              component={CustomField}
              options={[
                { label: 'Freelancer', value: 'FREELANCER' },
                { label: 'Employer', value: 'EMPLOYER' },
              ]}
              help="Select which account you would like to use"
            />
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
              styleType="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Signup With Email'}
            </Button>
          </Form>
        )}
      />
    </>
  );
};

export default SignupLocal;
