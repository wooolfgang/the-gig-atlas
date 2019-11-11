/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/prop-types */
import React from 'react';
import PersonalForm from '../../components/Onboard/Personal';
import OnboardContainer from '../../components/Onboard/Container';
import withAuthSync from '../../components/withAuthSync';

const Personal = ({ user }) => (
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
);

export default withAuthSync(Personal, 'MEMBER');
