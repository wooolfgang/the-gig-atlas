import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import FreelancerProfile from '../../components/FreelancerProfile';
import withAuthSync from '../../components/withAuthSync';
import media from '../../utils/media';
import { propTypes } from '../../utils/globals';

const Container = styled.main`
  width: 100vw;
  display: flex;
  box-sizing: border-box;
  box-shadow: inset 4px 20px 20px #fafafa;
  justify-content: center;
  padding: 1rem 0;
  min-height: calc(100vh - 67.5px);

  ${media.phone`
    padding: .2rem 0;
  `}
`;

const UserProfile = ({ router, user }) => {
  const userId = router.query.id;

  return (
    <>
      <Nav
        type={user ? 'AUTHENTICATED_FREELANCER' : 'NOT_AUTHENTICATED'}
        user={user}
      />
      <Container>
        <FreelancerProfile userId={userId} />
      </Container>
    </>
  );
};

UserProfile.propTypes = {
  router: PropTypes.shape({
    query: {
      id: PropTypes.string,
    },
  }).isRequired,
  user: propTypes.user,
};

UserProfile.defaultProps = {
  user: null,
};

export default withRouter(withAuthSync(UserProfile, 'all'));
