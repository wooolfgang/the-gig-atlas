/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';
import Container from '../../components/Onboard/Container';
import withAuthSync from '../../components/withAuthSync';
import router from '../../utils/router';

const Freelancer = ({ user }) => (
  <Container
    step="EMPLOYER"
    header={
      <div>
        <h1>
          {/* Hey, {user.firstName}{' '} */}
          {/* <span role="img" aria-label="wave" style={{ fontSize: '1em' }}>
            👋
          </span> */}
        </h1>
        <span>
          Your profile will help distinguish your brand and personality.
        </span>
      </div>
    }
    form={<div />}
  />
);

Freelancer.gerInitialProps = async ctx => {
  const { user } = ctx;

  if (user.onboardingStep === 'FREELANCER') {
    router.toError(ctx, { query: { message: 'Already a freelancer' } });
  }
};

export default withAuthSync(Freelancer, 'MEMBER');
