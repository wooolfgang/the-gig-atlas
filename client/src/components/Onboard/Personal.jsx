/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import { useMutation } from '@apollo/react-hooks';
import Button from '../../primitives/Button';
import CustomField from '../CustomField';
import { ONBOARDING_PERSONAL } from '../../graphql/user';
import router from '../../utils/router';

const labelStyle = {
  flex: '1',
  marginRight: '.5rem',
};

const Personal = ({ user }) => {
  let isFinished = false;
  const { firstName, lastName, onboardingStep } = user;
  const accountType = onboardingStep === 'PERSONAL' ? '' : onboardingStep;
  const [onboardingPersonal] = useMutation(ONBOARDING_PERSONAL, {
    onCompleted: data => {
      isFinished = true;
      const step = data.onboardingPersonal.onboardingStep;
      if (step === 'EMPLOYER') {
        router.toEmployerOnboarding();
      } else if (step === 'FREELANCER') {
        router.toFreelancerOnboarding();
      }
    },
    onError: e => {
      console.error('submit e: ', e);
    },
  });

  return (
    <Formik
      validationSchema={common.validation.onboardingPersonal}
      initialValues={{
        accountType,
        firstName: firstName || '',
        lastName: lastName || '',
      }}
      onSubmit={async (values, action) => {
        if (isFinished) {
          action.setSubmitting(false);
          return;
        }

        try {
          await onboardingPersonal({
            variables: { input: { ...values } },
          });
        } catch (e) {
          console.error(e);
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
            options={[
              { label: 'Freelancer', value: 'FREELANCER' },
              { label: 'Employer', value: 'EMPLOYER' },
            ]}
            help="Select which account you would like to use"
            labelStyle={labelStyle}
          />
          <Field
            name="firstName"
            label="First Name"
            component={CustomField}
            help="This is your given name"
            labelStyle={labelStyle}
          />
          <Field
            name="lastName"
            label="Last Name"
            component={CustomField}
            help="This is your surname"
            labelStyle={labelStyle}
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
