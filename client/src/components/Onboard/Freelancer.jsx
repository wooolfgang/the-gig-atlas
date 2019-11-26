/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import common from '@shared/common';
import { useMutation } from '@apollo/react-hooks';
import Button from '../../primitives/Button';
import CustomField from '../CustomField';
import PortfolioProjectsCreate from '../PortfolioProjectsCreate';
import router from '../../utils/router';
import { FieldError } from '../../primitives';
import { ONBOARDING_FREELANCER } from '../../graphql/user';

const labelStyle = {
  flex: '1',
  marginRight: '.5rem',
};

const socialMap = {
  GITHUB: {
    label: 'Github',
    placeholder: 'https://github.com/wooolfgang',
  },
  LINKEDIN: {
    label: 'Linkedin',
    placeholder: 'https://www.linkedin.com/in/jeffweiner08',
  },
  UPWORK: {
    label: 'Upwork',
    placeholder: 'https://www.upwork.com/profile/123',
  },
  TWITTER: {
    label: 'Twitter',
    placeholder: 'https://twitter.com/_wooolfgang',
  },
};

const socialList = Object.keys(socialMap).map(key => ({
  type: key,
  url: '',
}));

const Freelancer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingFreelancer] = useMutation(ONBOARDING_FREELANCER);

  return (
    <Formik
      validationSchema={common.validation.freelancerPortfolioInput}
      initialValues={{
        socials: [],
        portfolio: [],
        skills: [],
      }}
      onSubmit={async values => {
        try {
          setIsSubmitting(true);
          const input = { ...values, socials: _trimSocials(values.socials) };
          const { errors } = await onboardingFreelancer({
            variables: { input },
          });

          if (errors) {
            setIsSubmitting(false);
            throw errors;
          }
          router.toIndex();
        } catch (e) {
          setIsSubmitting(false);
          console.error('On freelancer submit', e);
        }
      }}
      render={({ values, setFieldValue, errors, handleSubmit, touched }) => (
        <Form>
          <Field
            name="skills"
            type="asyncselect"
            label="Skills"
            placeholder="React, Nodejs, Communication"
            component={CustomField}
          />
          <FieldArray
            name="socials"
            render={() => (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  marginBottom: '.5rem',
                }}
              >
                {socialList.map((social, index) => {
                  const { label, placeholder } = socialMap[social.type] || {
                    label: '',
                    placeholder: '',
                  };
                  return (
                    <Field
                      name={`socials[${index}].url`}
                      label={label}
                      placeholder={placeholder}
                      labelStyle={labelStyle}
                      component={CustomField}
                      key={social.type}
                    />
                  );
                })}
              </div>
            )}
          />
          <FieldError
            value={touched.socials && errors.socials}
            visible={!!(touched.socials && errors.socials)}
          />
          <div style={{ marginBottom: '.5rem' }} />
          <PortfolioProjectsCreate
            onChange={portfolio => {
              setFieldValue('portfolio', portfolio);
            }}
            portfolio={values.portfolio}
          />
          <FieldError
            value={touched.portfolio && errors.portfolio}
            visible={!!(touched.portfolio && errors.portfolio)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{
                marginTop: '.8rem',
                maxWidth: '150px',
                display: 'flex',
                alignItems: 'center',
              }}
              type="button"
              styleType="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={handleSubmit}
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

export default Freelancer;

// utils

function _trimSocials(socials) {
  return socials.filter(s => !!s.url);
}
