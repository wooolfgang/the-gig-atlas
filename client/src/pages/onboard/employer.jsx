/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';
import EmployerForm from '../../components/Onboard/Employer';
import Container from '../../components/Onboard/Container';
import withAuthSync from '../../components/withAuthSync';
import router from '../../utils/router';

const Employer = ({ user }) => (
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
    form={<EmployerForm user={user} />}
  />
);

Employer.gerInitialProps = async ctx => {
  const { user } = ctx;

  if (user.onboardingStep === 'FREELANCER') {
    router.toError(ctx, { query: { message: 'Already an employer' } });
  }
};

export default withAuthSync(Employer, 'MEMBER');
