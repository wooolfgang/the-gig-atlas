import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import Stepper from '../../../components/Stepper';
import CustomField from '../../../components/CustomField';
import withAuthSync from '../../../components/withAuthSync';
import NavLogoOnly from '../../../components/NavLogoOnly';
import { FREELANCER_ONBOARDING_PERSONAL } from '../../../graphql/freelancer';
import router from '../../../utils/router';
import Button from '../../../primitives/Button';
// import timezones from '../../../utils/timezones';

export const Container = styled.div`
  width: 100vw;
`;

export const StepperContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 900px;
  max-width: 100vw;
  margin: auto;
  padding-bottom: 1rem;
`;

export const BodyContainer = styled.div`
  background: ${props => props.theme.color.d6};
  padding: 1rem 0rem;
  box-sizing: border-box;
`;

export const FormContainer = styled.div`
  padding-top: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-bottom: 2rem;
  box-sizing: border-box;
  width: 900px;
  max-width: 100vw;
  margin: auto;
`;

export const Header = styled.div`
  margin: auto;
  width: 900px;
  max-width: 100vw;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
`;

const Onboarding = ({ authenticatedUser }) => {
  const { firstName, lastName } = authenticatedUser;
  const [freelancerOnboardingPersonal] = useMutation(
    FREELANCER_ONBOARDING_PERSONAL,
  );
  return (
    <div>
      <NavLogoOnly />
      <Container>
        <StepperContainer>
          <Stepper
            activeIndex={0}
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
            <h1>
              Hey, {firstName}{' '}
              <span role="img" aria-label="wave" style={{ fontSize: '1em' }}>
                👋
              </span>
            </h1>
            <span>
              Your profile will help distinguish your brand and personality.
            </span>
          </Header>
          <FormContainer>
            <Formik
              validationSchema={common.validation.freelancerPersonalInput}
              initialValues={{
                avatarFileId: '',
                firstName: firstName || '',
                lastName: lastName || '',
                bio: '',
              }}
              onSubmit={async values => {
                try {
                  await freelancerOnboardingPersonal({
                    variables: {
                      input: values,
                    },
                  });
                  router.toFreelancerOnboardingPortfolio();
                } catch (e) {
                  /**
                   * Handle error
                   */
                }
              }}
              render={({ isSubmitting }) => (
                <Form>
                  {!firstName && !lastName && (
                    <>
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
                    </>
                  )}
                  <Field
                    name="avatarFileId"
                    type="avatarupload"
                    label="Avatar"
                    component={CustomField}
                  />
                  <Field
                    name="bio"
                    type="texteditor"
                    label="About You"
                    placeholder="I am a React developer specialized in building awesome single page applications."
                    component={CustomField}
                  />
                  <Field
                    name="website"
                    label="Website"
                    placeholder="https://epicjohn.com"
                    component={CustomField}
                    required={false}
                  />
                  {/*
                    Temporarily not use this for now to make the onboarding as simple as possible
                    for the freelancer
                  */}
                  {/*
                  <Field
                    name="location"
                    label="Location"
                    placeholder="Machu Pichu, Peru"
                    component={CustomField}
                    required={false}
                  />
                  <Field
                    name="timezone"
                    type="select"
                    label="Timezone"
                    placeholder="Select Timezone"
                    component={CustomField}
                    options={timezones}
                    required={false}
                  /> */}
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
          </FormContainer>
        </BodyContainer>
      </Container>
    </div>
  );
};

Onboarding.propTypes = {
  authenticatedUser: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default withAuthSync(Onboarding);
