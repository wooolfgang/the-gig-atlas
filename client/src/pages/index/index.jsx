import React from 'react';
import PropTypes from 'prop-types';
import withNoAuthSync from '../../components/withNoAuthSync';
import Authenticated from './authenticated';
import Landing from './landing';

const Index = ({ authenticatedUser }) => {
  if (authenticatedUser) return <Authenticated />;
  return <Landing />;
};

Index.propTypes = {
  authenticatedUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }),
};

Index.defaultProps = {
  authenticatedUser: null,
};

export default withNoAuthSync(Index);
