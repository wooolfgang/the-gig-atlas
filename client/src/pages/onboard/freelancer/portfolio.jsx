import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import common from '@shared/common';
import styled from 'styled-components';
import Nav from '../../../components/Nav';
import Stepper from '../../../components/Stepper';
import CustomField from '../../../components/CustomField';
import { Button, FieldError, Spinner } from '../../../primitives';
import router from '../../../utils/router';
import {
  Container,
  StepperContainer,
  BodyContainer,
  FormContainer,
  Header,
} from './index';
import PortfolioProjectsCreate from '../../../components/PortfolioProjectsCreate';
import {
  FREELANCER_ONBOARDING_PORTFOLIO,
  SKIP_FREELANCER_ONBOARDING,
} from '../../../graphql/freelancer';

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

const Skip = styled.span`
  color: ${props => props.theme.color.s2};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

const labelStyle = {
  flex: '1',
  marginRight: '.5rem',
};

const OnboardingPortfolio = () => {
  const [redirecting, setRedirecting] = useState(false);
  const [freelancerOnboardingPortfolio] = useMutation(
    FREELANCER_ONBOARDING_PORTFOLIO,
  );
  const [skipFreelancerOnboarding] = useMutation(SKIP_FREELANCER_ONBOARDING);

  return (
    <div>
      <Nav type="LOGO_ONLY" />
      <Container>
        <StepperContainer>
          <Stepper
            activeIndex={1}
            steps={[
              {
                title: 'Personal Profile',
                description: 'Be unique, stand out.',
              },
              {
                title: 'Freelancer Portfolio',
                description: 'Show your best work to the world.',
              },
            ]}
          />
        </StepperContainer>
        <BodyContainer>
          <Header>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h1>
                  Complete your profile
                  <span
                    role="img"
                    aria-label="wave"
                    style={{ fontSize: '1em' }}
                  >
                    {' '}
                    💻
                  </span>
                </h1>
                <span>
                  Add your skills and show your best work to the world.
                </span>
              </div>
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
                  "Skip, I'll do this it later ->"
                )}
              </Skip>
            </div>
          </Header>
          <FormContainer>
            <Formik
              onSubmit={async values => {
                await freelancerOnboardingPortfolio({
                  variables: {
                    input: values,
                  },
                });
                router.toIndex();
              }}
              initialValues={{
                socials: Object.keys(socialMap).map(key => ({
                  type: key,
                  url: '',
                })),
                portfolio: [],
                skills: [],
              }}
              validationSchema={common.validation.freelancerPortfolioInput}
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
                          const { label, placeholder } = socialMap[
                            social.type
                          ] || { label: '', placeholder: '' };
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
          </FormContainer>
        </BodyContainer>
      </Container>
    </div>
  );
};

export default OnboardingPortfolio;
