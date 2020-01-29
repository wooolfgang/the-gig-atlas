import React, { useState } from 'react';
import styled from 'styled-components';
import { useApolloClient } from '@apollo/react-hooks';
import withAuthSync from '../components/withAuthSync';
import GigsList from '../components/GigsList';
import { GIG_SEARCH, GIG_NEXT_PAGE } from '../graphql/gig';
import { GigCardSkeleton } from '../components/GigCard';
import { propTypes } from '../utils/globals';
import media from '../utils/media';
import Button from '../primitives/Button';
import createThrottle from '../utils/throttle';
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

const Gigs = ({ user }) => {
  // searching for new search only not for paging loaded query
  const [isSearching, setSearching] = useState(false);
  const [paging, setPage] = useState({
    gigs: [], // gigs to be displayed
    totalResults: 0,
    page: 1, // number of gig batch loaded as page
    isLoading: false, // state for loading for next gigs
    resultIds: [], // containes all ids that will be referenced for paging
  });
  const [searchVariables, setSearchVariables] = useState({
    search: '',
    first: 8, // first is the number of items gigs to be queried and incremental loaded
    where: {}, // where reference to client only not on server searchGig where parameter
  });

  const startSearching = () => setSearching(true);
  const stopSearching = () => setSearching(false);
  const hasNextPage = () =>
    searchVariables.first * paging.page < paging.totalResults;

  const client = useApolloClient();

  const newSearch = async ({ search, first, where = {} }) => {
    startSearching();
    const options = { search, where: { ...where, first } };
    try {
      const res = await client.query({
        query: GIG_SEARCH,
        variables: options,
      });
      const { gigs, ids } = res.data.searchGigs;
      setPage({
        gigs,
        totalResults: ids.length,
        page: 1,
        resultIds: ids,
      });
    } catch (e) {
      console.error(e);
    }
    stopSearching();
  };

  const nextPage = async () => {
    if (!hasNextPage()) {
      return;
    }

    const { page, resultIds } = paging;
    const { first } = searchVariables;
    const nextIds = [];
    const start = page * first;
    const end = page * first + first;
    for (let i = start; i < end; i += 1) {
      if (!resultIds[i]) break;
      nextIds.push(resultIds[i]);
    }

    try {
      setPage(prev => ({ ...prev, isLoading: true }));
      const res = await client.query({
        query: GIG_NEXT_PAGE,
        variables: { ids: nextIds },
      });
      const newGigs = res.data.nextPage;

      setPage(prev => ({
        ...prev,
        gigs: [...prev.gigs, ...newGigs],
        page: prev.page + 1,
        isLoading: false,
      }));
    } catch (e) {
      setPage(prev => ({ ...prev, isLoading: false }));
    }
  };

  const throttleSearching = createThrottle(1000, newOption => {
    if (!searchVariables.search.trim()) {
      return;
    }

    startSearching();
    newSearch(newOption).then(() => stopSearching());
  });

  const handleTextSearch = search => {
    setSearchVariables(p => ({ ...p, search }));
    newSearch({ ...searchVariables, search });
  };

  const handleFiltering = (filter, value, checked) => {
    setSearchVariables(prevVal => {
      const where = {
        ...prevVal.where,
      };

      if (checked && !(where[filter] instanceof Array)) {
        where[filter] = [];
      }

      if (checked && where[filter] instanceof Array) {
        where[filter].push(value);
      } else if (!checked && where[filter] instanceof Array) {
        where[filter] = where[filter].filter(v => v !== value);
      }

      if (where[filter] && where[filter].length === 0 && !checked) {
        delete where[filter];
      }

      const vars = { ...prevVal, where };

      throttleSearching(vars);

      return vars;
    });
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
          {isSearching ? (
            <div>
              <GigCardSkeleton />
              <GigCardSkeleton />
              <GigCardSkeleton />
              <GigCardSkeleton />
            </div>
          ) : (
            <>
              <GigsList gigs={paging.gigs} />
              {hasNextPage() && (
                <Button onClick={nextPage} loading={paging.isLoading}>
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
