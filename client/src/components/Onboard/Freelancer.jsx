/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import common from '@shared/common';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import Button from '../../primitives/Button';
import CustomField from '../CustomField';
import {
  FREELANCER_ONBOARDING_PORTFOLIO,
  SKIP_FREELANCER_ONBOARDING,
} from '../../graphql/freelancer';
import PortfolioProjectsCreate from '../PortfolioProjectsCreate';
import router from '../../utils/router';
import { FieldError, Spinner } from '../../primitives';

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

const labelStyle = {
  flex: '1',
  marginRight: '.5rem',
};

const Skip = styled.span`
  color: ${props => props.theme.color.s2};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

const Employer = ({ user }) => {
  const [redirecting, setRedirecting] = useState(false);
  const [skipFreelancerOnboarding] = useMutation(SKIP_FREELANCER_ONBOARDING);
  const [freelancerOnboardingPortfolio] = useMutation(
    FREELANCER_ONBOARDING_PORTFOLIO,
  );
  return (
    <Formik
      validationSchema={common.validation.onboardingEmployer}
      initialValues={{
        socials: Object.keys(socialMap).map(key => ({
          type: key,
          url: '',
        })),
        portfolio: [],
        skills: [],
      }}
      onSubmit={async values => {
        await freelancerOnboardingPortfolio({
          variables: {
            input: values,
          },
        });
        router.toIndex();
      }}
      render={({
        values,
        isSubmitting,
        setFieldValue,
        errors,
        handleSubmit,
        touched,
      }) => (
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
                {values.socials.map((social, index) => {
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
            <Skip
              onClick={async () => {
                try {
                  await skipFreelancerOnboarding();
                  setRedirecting(true);
                  router.toIndex();
                } catch (e) {
                  setRedirecting(false);
                }
              }}
            >
              {redirecting ? (
                <>
                  Redirecting... <Spinner />{' '}
                </>
              ) : (
                "Skip, I'll do this it later"
              )}
            </Skip>
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

export default Employer;
