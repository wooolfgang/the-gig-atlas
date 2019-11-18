/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';
import OnboardingFreelancer from '../../components/Onboard/Container';
import withAuthSync from '../../components/withAuthSync';
import Portfolio from '../../components/Onboard/Freelancer';
import Nav from '../../components/Nav';
import router from '../../utils/router';

const Freelancer = () => (
  <>
    <Nav type="LOGO_ONLY" />
    <OnboardingFreelancer
      step="FREELANCER"
      header={
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
              <span role="img" aria-label="wave" style={{ fontSize: '1em' }}>
                {' '}
                💻
              </span>
            </h1>
            <span>Add your skills and show your best work to the world.</span>
          </div>
        </div>
      }
      form={<Portfolio />}
    />
  </>
);

Freelancer.getInitialProps = async ctx => {
  const { user } = ctx;

  if (user.onboardingStep === 'PERSONAL') {
    router.toPersonalOnboarding(ctx);
  } else if (user.onboardingStep === 'EMPLOYER') {
    router.toEmployerOnboarding(ctx);
  }

  return { user };
};

export default withAuthSync(Freelancer, 'MEMBER');
