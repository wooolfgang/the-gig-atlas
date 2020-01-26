/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
// import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/react-hooks';
import withAuthSync from '../components/withAuthSync';
import GigsList from '../components/GigsList';
import { GIG_SEARCH, GIG_NEXT_PAGE } from '../graphql/gig';
import { GigCardSkeleton } from '../components/GigCard';
// import { JOB_TYPE, PROJECT_TYPE, PAYMENT_TYPE } from '../utils/constants';
import { propTypes } from '../utils/globals';
// import debounce from '../utils/debounce';
import media from '../utils/media';
import Button from '../primitives/Button';
import createThrottle from '../utils/throtle';
import Nav from '../components/Nav';
import Search from '../components/Gig/GigSearch';
import FilterSidebar from '../components/Gig/Sidebar';

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
  const [isSearching, setSearching] = useState(false);
  const [paging, setPage] = useState({
    gigs: [],
    totalResults: 0,
    page: 1,
    isLoading: false,
    resultIds: [],
  });
  const [searchVariables, setSearchVariables] = useState({
    search: '',
    first: 8,
    where: {},
  });

  const startSearching = () => setSearching(true);
  const stopSearching = () => setSearching(false);
  const hasNextPage = () =>
    searchVariables.first * paging.page < paging.totalResults;

  const client = useApolloClient();
  // let resultIds = [];

  const newSearch = async ({ search, first, where = {} }) => {
    const options = { search, where: { ...where, first } };
    console.log('new Search: ', options);
    try {
      const res = await client.query({
        query: GIG_SEARCH,
        variables: options,
      });
      const { gigs, ids } = res.data.searchGigs;
      console.log('new gigs: ', gigs.length, ids.length);
      console.log(gigs);
      // resultIds = ids;
      // console.log('new result ids: ', resultIds);
      setPage({
        gigs,
        totalResults: ids.length,
        page: 1,
        resultIds: ids,
      });
    } catch (e) {
      console.log('search erro: ', e);
    }
  };

  const nextPage = async () => {
    if (!hasNextPage()) {
      return;
    }

    const { page, resultIds } = paging;
    const { first } = searchVariables;
    // const end = page * first + first >
    const nextIds = [];
    const start = page * first;
    const end = page * first + first;
    console.log(start, end, resultIds);
    for (let i = start; i < end; i++) {
      if (!resultIds[i]) break;
      nextIds.push(resultIds[i]);
    }

    console.log('next ids: ', nextIds);

    try {
      setPage(prev => ({ ...prev, isLoading: true }));
      const res = await client.query({
        query: GIG_NEXT_PAGE,
        variables: { ids: nextIds },
      });
      const newGigs = res.data.nextPage;
      console.log('next gigs: ', newGigs);

      setPage(prev => ({
        ...prev,
        gigs: [...prev.gigs, ...newGigs],
        page: prev.page + 1,
        isLoading: false,
      }));
    } catch (e) {
      console.log(e);
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

  // useEffect(() => {
  //   startSearching();
  //   newSearch({ search: 'senior' }).then(() => stopSearching());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

  // const handleShowMore = () =>
  //   setSearchVariables(prevVal => ({
  //     ...prevVal,
  //     first: prevVal.first + 8,
  //   }));

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
