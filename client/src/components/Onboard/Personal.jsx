/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import Button from '../../primitives/Button';
import CustomField from '../CustomField';

const Personal = ({ user }) => {
  const { firstName, lastName } = user;

  return (
    <Formik
      validationSchema={common.validation.freelancerPersonalInput}
      initialValues={{
        firstName: firstName || '',
        lastName: lastName || '',
        accountType: '',
      }}
      onSubmit={async values => {
        /**
         * @todo: update change here
         */
        // try {
        //   await freelancerOnboardingPersonal({
        //     variables: {
        //       input: values,
        //     },
        //   });
        //   router.toFreelancerOnboardingPortfolio();
        // } catch (e) {
        //   /**
        //    * Handle error
        //    */
        // }
      }}
      render={({ isSubmitting }) => (
        <Form>
          <Field
            name="accountType"
            type="select"
            label="Account type"
            component={CustomField}
            value=""
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
