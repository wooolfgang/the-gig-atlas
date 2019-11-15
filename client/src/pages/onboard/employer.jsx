/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';
import EmployerForm from '../../components/Onboard/Employer';
import OnboardingContainer from '../../components/Onboard/Container';
import withAuthSync from '../../components/withAuthSync';
import router from '../../utils/router';

const Employer = ({ user }) => (
  <OnboardingContainer
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
    form={<EmployerForm user={user} />}
  />
);

Employer.getInitialProps = async ctx => {
  const { user } = ctx;
  if (user.asEmployer) {
    router.toError(ctx, { query: { message: 'Already an employer' } });
  } else if (user.onboardingStep !== 'EMPLOYER') {
    router.toError(ctx, { query: { message: 'Must be an employer' } });
  }

  return { user };
};

export default withAuthSync(Employer, 'MEMBER');
