import React from 'react';
import Authenticated from './authenticated';
import Landing from './landing';
import withAuthSync from '../../components/withAuthSync';
import { propTypes } from '../../utils/globals';

const Index = ({ user }) => {
  if (user) {
    return <Authenticated user={user} />;
  }
  return <Landing />;
};

Index.propTypes = {
  user: propTypes.user,
};

Index.defaultProps = {
  user: null,
};
export default withAuthSync(Index, 'all');
