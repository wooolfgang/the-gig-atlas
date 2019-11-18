/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Stepper from '../Stepper';

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

const OnboardContainer = ({ step, header, form }) => (
  <div>
    <Container>
      <StepperContainer>
        <Stepper
          activeIndex={step !== 'PERSONAL' ? 1 : 0}
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
        <Header>{header}</Header>
        <FormContainer>{form}</FormContainer>
      </BodyContainer>
    </Container>
  </div>
);

export default OnboardContainer;

// eslint-disable-next-line consistent-return
function _profileType(step) {
  if (step === 'PERSONAL') {
    return {
      title: 'Account Profile',
      description: 'Input account info',
    };
  }
  if (step === 'EMPLOYER') {
    return {
      title: 'Employer Info',
      description: 'Write about your emloyment',
    };
  }
  if (step === 'FREELANCER') {
    return {
      title: 'Freelancer Portfolio',
      description: 'Show your best work to the world.',
    };
  }
}
