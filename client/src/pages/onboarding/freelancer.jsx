import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { StyledNav, LogoContainer } from '../../components/Nav/style';
import { NavLink, Logo, Button } from '../../primitives';
import Stepper from '../../components/Stepper';
import CustomField from '../../components/CustomField';
import timezones from '../../utils/timezones';
import withAuthSync from '../../components/withAuthSync';

const Container = styled.div`
  width: 100vw;
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 900px;
  max-width: 100vw;
  margin: auto;
  padding-bottom: 1rem;
`;

const BodyContainer = styled.div`
  background: ${props => props.theme.color.d6};
  padding: 1rem 0rem;
  box-sizing: border-box;
`;

const FormContainer = styled.div`
  padding-top: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-bottom: 2rem;
  box-sizing: border-box;
  width: 900px;
  max-width: 100vw;
  margin: auto;
`;

const Header = styled.div`
  margin: auto;
  width: 900px;
  max-width: 100vw;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
`;

const Onboarding = ({ authenticatedUser }) => {
  const { firstName, lastName } = authenticatedUser;
  return (
    <div>
      <StyledNav>
        <NavLink href="/">
          <LogoContainer>
            <Logo />
          </LogoContainer>
        </NavLink>
        <div />
      </StyledNav>
      <Container>
        <StepperContainer>
          <Stepper
            activeIndex={0}
            steps={[
              {
                title: 'Personal Profile',
                description: 'Be unique, be creative.',
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
              initialValues={{
                avatarFileId: '',
                firstName,
                lastName,
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
                  />
                  <Field
                    name="location"
                    label="Location"
                    placeholder="Machu Pichu, Peru"
                    component={CustomField}
                  />
                  <Field
                    name="timezone"
                    type="select"
                    label="Timezone"
                    placeholder="Select Timezone"
                    component={CustomField}
                    options={timezones}
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
