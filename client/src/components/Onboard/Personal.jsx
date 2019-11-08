/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import { useMutation } from '@apollo/react-hooks';
import Button from '../../primitives/Button';
import CustomField from '../CustomField';
import { ONBOARDING_PERSONAL } from '../../graphql/user';
import router from '../../utils/router';

const Personal = ({ user }) => {
  const { firstName, lastName, id } = user;
  const [onboardingPersonal] = useMutation(ONBOARDING_PERSONAL);

  return (
    <Formik
      validationSchema={common.validation.onboardingPersonal}
      initialValues={{
        firstName: firstName || '',
        lastName: lastName || '',
        accountType: '',
      }}
      onSubmit={async (values, action) => {
        console.log('submit values: ', values);
        try {
          const { data, errors } = await onboardingPersonal({
            variables: { input: { ...values, id } },
          });

          if (errors) {
            throw errors;
          }
          console.log(data);
          router.toOnboarding({}, { query: { step: data.onboardingPersonal } });
        } catch (e) {
          console.log(e);
        }
        action.setSubmitting(false);
      }}
      render={({ isSubmitting }) => (
        <Form>
          <Field
            name="accountType"
            type="select"
            label="Account type"
            component={CustomField}
            value={null}
            options={[
              { label: 'Freelancer', value: 'FREELANCER' },
              { label: 'Employer', value: 'EMPLOYER' },
            ]}
            help="Select which account you would like to use"
          />
          <Field
            name="firstName"
            label="First Name"
            component={CustomField}
            help="This is your given name"
          />
          <Field
            name="lastName"
            label="Last Name"
            component={CustomField}
            help="This is your surname"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{
                marginTop: '.8rem',
                maxWidth: '150px',
                display: 'flex',
                alignItems: 'center',
              }}
              type="submit"
              styleType="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? (
                'Submitting... '
              ) : (
                <>
                  <span>Continue </span>
                  <img
                    src="/static/arrow-right.svg"
                    alt="arrow-right-icon"
                    style={{ width: '1rem' }}
                  />
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    />
  );
};

export default Personal;
