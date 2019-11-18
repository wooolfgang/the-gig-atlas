/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';
import PersonalForm from '../../components/Onboard/Personal';
import OnboardContainer from '../../components/Onboard/Container';
import withAuthSync from '../../components/withAuthSync';
import Nav from '../../components/Nav';
import router from '../../utils/router';

const Personal = ({ user }) => (
  <>
    <Nav type="LOGO_ONLY" />
    <OnboardContainer
      step="PERSONAL"
      header={
        <div>
          <h1>
            Hey, {user.firstName}{' '}
            <span role="img" aria-label="wave" style={{ fontSize: '1em' }}>
              👋
            </span>
          </h1>
          <span>
            Your profile will help distinguish your brand and personality.
          </span>
        </div>
      }
      form={<PersonalForm user={user} />}
    />
  </>
);

Personal.getInitialProps = async ctx => {
  const { user } = ctx;

  if (user.onboardingStep === 'FREELANCER') {
    router.toFreelancerOnboarding(ctx);
  } else if (user.onboardingStep === 'EMPLOYER') {
    router.toEmployerOnboarding(ctx);
  }

  return { user };
};

export default withAuthSync(Personal, 'MEMBER');
