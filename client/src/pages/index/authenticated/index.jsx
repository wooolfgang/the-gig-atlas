import React from 'react';
import Nav from '../../../components/Nav';
import Community from '../../../components/Community';
import { propTypes } from '../../../utils/globals';

const Authenticated = ({ user }) => (
  <>
    <Nav type="AUTHENTICATED_FREELANCER" user={user} />
    <Community user={user} />
  </>
);

Authenticated.propTypes = {
  user: propTypes.user.isRequired,
};

export default Authenticated;
