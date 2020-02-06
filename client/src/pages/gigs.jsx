import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import withAuthSync from '../components/withAuthSync';
import GigsList from '../components/GigsList';
import { GIG_SEARCH } from '../graphql/gig';
import { GigCardSkeleton } from '../components/GigCard';
import { propTypes } from '../utils/globals';
import media from '../utils/media';
import Button from '../primitives/Button';
import Nav from '../components/Nav';
import Search from '../components/GigSearch';
import FilterSidebar from '../components/GigFilterSidebar';

const Container = styled.main`
  padding: 2rem 1rem;
  box-sizing: border-box;
  display: grid;
  grid-template-areas:
    '. . . search . . .'
    '. filter . gigs . sidebar .'
    '. . . . . . .';
  grid-template-columns: auto 200px 3rem 650px 3rem 100px auto;
  grid-template-rows: 2rem auto 1rem;
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 67.5px);

  ${media.tablet`
    grid-template-areas:
      '. search .'
      '. filter .'
      '. gigs .'
      '. sidebar .';
      ; 
    grid-template-columns: .3rem auto .3rem;
    grid-template-rows: 2rem auto auto 2rem;
  `}
`;

const GigsContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  padding: 30px 0px;
  box-sizing: border-box;
  grid-area: gigs;
`;

const GigsSkeletonLoading = () => (
  <div>
    <GigCardSkeleton />
    <GigCardSkeleton />
    <GigCardSkeleton />
    <GigCardSkeleton />
  </div>
);

const PAGE_COUNT = 8;

const Gigs = ({ user }) => {
  const [searchVariables, setSearchVariables] = useState({
    search: '',
    first: PAGE_COUNT,
    where: {},
  });
  const [isShowMoreLoading, setIsShowMoreLoading] = useState(false);
  const { data, loading } = useQuery(GIG_SEARCH, {
    variables: searchVariables,
    fetchPolicy: 'cache-and-network',
    onCompleted: () => setIsShowMoreLoading(false),
  });

  const hasNextPage = !!(
    data &&
    data.searchGigs.total &&
    data.searchGigs.total > searchVariables.first
  );

  const handleTextSearch = val =>
    setSearchVariables(prevVal => ({ ...prevVal, search: val }));

  const handleFiltering = (filter, value, checked) => {
    setSearchVariables(prevVal => {
      const where = { ...prevVal.where };
      let isKeyFilterArray = where[filter] instanceof Array;

      if (checked && !isKeyFilterArray) {
        where[filter] = [];
        isKeyFilterArray = true;
      }

      if (checked && isKeyFilterArray) {
        where[filter].push(value);
      } else if (!checked && isKeyFilterArray) {
        where[filter] = where[filter].filter(v => v !== value);
      }

      if (where[filter] && where[filter].length === 0 && !checked) {
        delete where[filter];
      }

      return { ...prevVal, where };
    });
  };

  const handleShowMore = () => {
    setIsShowMoreLoading(true);
    setSearchVariables(prevVal => ({
      ...prevVal,
      first: prevVal.first + PAGE_COUNT,
    }));
  };

  return (
    <div>
      <Nav
        type={user ? 'AUTHENTICATED_FREELANCER' : 'NOT_AUTHENTICATED'}
        user={user}
      />
      <Container>
        <Search onSearch={handleTextSearch} />
        <FilterSidebar handleFiltering={handleFiltering} />
        <GigsContainer>
          {loading && !isShowMoreLoading ? (
            <GigsSkeletonLoading />
          ) : (
            <>
              <GigsList gigs={data ? data.searchGigs.gigs : []} />
              {loading && isShowMoreLoading && <GigsSkeletonLoading />}
              {hasNextPage && (
                <Button
                  onClick={handleShowMore}
                  loading={isShowMoreLoading}
                  disabled={isShowMoreLoading}
                >
                  Show More
                </Button>
              )}
            </>
          )}
        </GigsContainer>
      </Container>
    </div>
  );
};

Gigs.propTypes = {
  user: propTypes.user,
};

Gigs.defaultProps = {
  user: null,
};

export default withAuthSync(Gigs, 'all');
