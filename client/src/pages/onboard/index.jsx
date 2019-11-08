/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import common from '@shared/common';
import Stepper from '../../components/Stepper';
import CustomField from '../../components/CustomField';
import withAuthSync from '../../components/withAuthSync';
import NavLogoOnly from '../../components/NavLogoOnly';
import { FREELANCER_ONBOARDING_PERSONAL } from '../../graphql/freelancer';
import router from '../../utils/router';
import Button from '../../primitives/Button';
// import timezones from '../../../utils/timezones';
import PersonalOnboard from '../../components/Onboard/Personal';

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

const Onboarding = ({ user, step }) => {
  const { firstName } = user;
  // const [freelancerOnboardingPersonal] = useMutation(
  //   FREELANCER_ONBOARDING_PERSONAL,
  // );
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
              _profileType(step),
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
            <PersonalOnboard user={user} />
          </FormContainer>
        </BodyContainer>
      </Container>
    </div>
  );
};

Onboarding.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

Onboarding.getInitialProps = ctx => {
  const { step } = ctx.query;

  return { step };
};

export default withAuthSync(Onboarding, 'MEMBER');

// eslint-disable-next-line consistent-return
function _profileType(step) {
  if (step === 'PERSONAL') {
    return {
      title: 'Account Profile',
      description: 'Input account info',
    };
  }
  if (step === 'E_INFO') {
    return {
      title: 'Employer Info',
      description: 'Write about your emloyment',
    };
  }
  if (step === 'F_PORTFOLIO') {
    return {
      title: 'Freelancer info',
      description: 'Tell us more about you',
    };
  }
}
