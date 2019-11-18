/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';
import EmployerForm from '../../components/Onboard/Employer';
import OnboardingContainer from '../../components/Onboard/Container';
import withAuthSync from '../../components/withAuthSync';
import Nav from '../../components/Nav';
import router from '../../utils/router';

const Employer = ({ user }) => (
  <>
    <Nav type="LOGO_ONLY" />
    <OnboardingContainer
      step="EMPLOYER"
      header={
        <div>
          <h1>
            Hey, {user.firstName}
            <span role="img" aria-label="wave" style={{ fontSize: '1em' }}>
              👋
            </span>
          </h1>
          <span>
            Your profile will help distinguish your brand and personality.
          </span>
        </div>
      }
      form={<EmployerForm user={user} />}
    />
  </>
);

Employer.getInitialProps = async ctx => {
  const { user } = ctx;

  if (user.onboardingStep === 'PERSONAL') {
    router.toPersonalOnboarding(ctx);
  } else if (user.onboardingStep === 'FREELANCER') {
    router.toFreelancerOnboarding(ctx);
  }

  return { user };
};

export default withAuthSync(Employer, 'MEMBER');
