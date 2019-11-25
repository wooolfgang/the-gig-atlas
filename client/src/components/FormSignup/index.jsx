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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signup] = useMutation(SIGNUP_LOCAL, { onError: setError });

  return (
    <>
      <Formik
        onSubmit={async values => {
          setIsSubmitting(true);
          try {
            const res = await signup({
              variables: { input: values },
            });

            if (!res) {
              throw new Error('Failed to signup');
            }

            const { errors, data } = res;
            if (errors) {
              throw errors;
            }

            auth.setTokenCookie(data.signup.token);
            router.toPersonalOnboarding();
          } catch (e) {
            /**
             * @todo: handle error
             */
            setError(e);
            setIsSubmitting(false);
          }
        }}
        initialValues={{
          accountType: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        }}
        validationSchema={common.validation.signupInput}
        render={() => (
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
              labelStyle={{ marginBottom: '.6rem' }}
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
