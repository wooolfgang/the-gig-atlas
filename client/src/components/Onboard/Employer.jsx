/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import { useMutation } from '@apollo/react-hooks';
import Button from '../../primitives/Button';
import CustomField from '../CustomField';
import { ONBOARDING_EMPLOYER } from '../../graphql/user';
import router from '../../utils/router';

const Employer = ({ user }) => {
  const { id } = user;
  const [onboardingEmployer] = useMutation(ONBOARDING_EMPLOYER);

  return (
    <Formik
      validationSchema={common.validation.onboardingEmployer}
      initialValues={{
        employerType: '',
        displayName: '',
        introduction: '',
        email: '',
        website: '',
        avatarFileId: '',
      }}
      onSubmit={async (values, action) => {
        console.log('submit values: ', values);
        try {
          const { data, errors } = await onboardingEmployer({
            variables: { input: { ...values, id } },
          });

          if (errors) {
            throw errors;
          }
          console.log(data);
          // router.toOnboarding({}, { query: { step: data.onboardingPersonal } });
        } catch (e) {
          console.log(e);
        }
        action.setSubmitting(false);
      }}
      render={({ isSubmitting }) => (
        <Form>
          <Field
            name="employerType"
            type="select"
            label="Employment"
            value={null}
            component={CustomField}
            options={[
              { label: 'Company', value: 'COMPANY' },
              { label: 'Personal', value: 'PERSONAL' },
            ]}
            help="Select what type of employer you are"
          />
          <Field
            name="displayName"
            label="Business name"
            component={CustomField}
            help="To display your business name"
          />
          <Field
            name="email"
            label="Contact email"
            component={CustomField}
            help="Input contact email"
          />
          <Field
            name="introduction"
            label="Introduction"
            type="textarea"
            component={CustomField}
            help="Write something about your business (Optional)"
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
              {isSubmitting ? 'Submitting... ' : <span>Finish </span>}
            </Button>
          </div>
        </Form>
      )}
    />
  );
};

export default Employer;
