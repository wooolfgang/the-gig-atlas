import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import HTMLHead from '../../components/HTMLHead';
import Nav from '../../components/Nav';
import { GET_GIG } from '../../graphql/gig';
import Gig from '../../components/Gig';
import withAuthSync from '../../components/withAuthSync';
import { propTypes } from '../../utils/globals';

const Container = styled.div`
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  min-height: calc(100vh - 67.5px);
  padding: 1rem 0.25rem 3rem 0.25rem;
`;

const Main = styled.main`
  width: 800px;
  max-width: 100vw;
  box-shadow: 4px 20px 20px ${props => props.theme.color.d5};
  border: 2px solid #fafafa;
  margin: 2rem auto 0;
  background: white;
`;

const GigPage = ({ router, user }) => {
  const { id } = router.query;
  const { data } = useQuery(GET_GIG, {
    variables: {
      id,
    },
  });

  return (
    <div>
      <HTMLHead title="" />
      <Nav
        type={user ? 'AUTHENTICATED_FREELANCER' : 'NOT_AUTHENTICATED'}
        user={user}
      />
      <Container>
        <Main>
          <Gig
            gig={data && data.gig}
            preview
            employer={data && data.gig.employer}
          />
        </Main>
      </Container>
    </div>
  );
};

GigPage.propTypes = {
  router: PropTypes.shape({
    query: {
      id: PropTypes.string,
    },
  }).isRequired,
  user: propTypes.user,
};

GigPage.defaultProps = {
  user: null,
};

/**
 * Use withRouter instead of useRouter since with-apollo-auth
 * is having issues getting router on server-side with useRouter
 * See here for issue => https://github.com/zeit/next.js/issues/7731
 */
export default withRouter(withAuthSync(GigPage, 'all'));
