import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Nav from '../components/Nav';
import withAuthSync from '../components/withAuthSync';
import GigsList from '../components/GigsList';
import { GIG_SEARCH } from '../graphql/gig';
import { GigCardSkeleton } from '../components/GigCard';
import { JOB_TYPE, PROJECT_TYPE, PAYMENT_TYPE } from '../utils/constants';
import SearchIcon from '../icons/Search';
import { color } from '../utils/theme';
import { propTypes } from '../utils/globals';
import debounce from '../utils/debounce';

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
`;

const SearchContainer = styled.div`
  width: 100%;
  margin: auto;
  max-width: 100vw;
  height: 2.25rem;
  grid-area: search;
  z-index: 50;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
  background: ${props => props.theme.color.d6};
  border: 2px solid ${props => props.theme.color.d4};
  transition: all 100ms ease-out;
  outline: none;

  :focus-within {
    border: 2px solid ${props => props.theme.color.s2};
    box-shadow: 0 0 0;
    background-color: white;
  }
`;

const SearchInput = styled.input`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  width: 100%;
  font-size: 1rem;
  padding: 0.35rem 0.7rem;
  outline: none;
  border: none;
  background: none;
`;

const GigsContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  margin: auto;
  padding: 30px 0px;
  box-sizing: border-box;
  grid-area: gigs;
`;

const FilterContainer = styled.div`
  grid-area: filter;
  padding: 1rem;
  box-sizing: border-box;
  position: sticky;
  top: 0;

  .filter-name {
    margin: 0.75rem 0;
    color: ${props => props.theme.color.neutral80};
  }

  .filter-label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.color.neutral70};
  }
`;

const Search = ({ onSearch }) => {
  const router = useRouter();
  const searchRef = useRef(null);
  const { focused } = router.query;

  useEffect(() => {
    if (searchRef && focused) {
      searchRef.current.focus();
    }
  });

  return (
    <SearchContainer>
      <SearchInput
        placeholder="Search for remote gigs and jobs"
        ref={searchRef}
        onChange={e => onSearch(e.target.value)}
      />
      <SearchIcon style={{ padding: '0 .5rem' }} fill={color.d4} />
    </SearchContainer>
  );
};

const Gigs = ({ user }) => {
  const [searchValue, setSearchValue] = useState('');
  const { data, loading } = useQuery(GIG_SEARCH, {
    variables: {
      search: searchValue,
    },
  });

  function renderNav() {
    if (!user) {
      return <Nav type="NOT_AUTHENTICATED" />;
    }
    return <Nav type="AUTHENTICATED_FREELANCER" user={user} />;
  }

  const debounced = debounce(searchValue => {
    setSearchValue(searchValue);
  }, 2000);

  return (
    <div>
      {renderNav()}
      <Container>
        <Search onSearch={debounced} />
        <FilterContainer>
          <p className="filter-name">Job Type</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Object.keys(JOB_TYPE).map(key => (
              <label htmlFor={`job-type-${key}`} className="filter-label">
                <input type="checkbox" id={`job-type-${key}`} value={key} />{' '}
                {JOB_TYPE[key]}
              </label>
            ))}
          </div>
          <p className="filter-name">Project Type</p>
          {Object.keys(PROJECT_TYPE).map(key => (
            <label htmlFor={`project-type-${key}`} className="filter-label">
              <input type="checkbox" id={`project-type-${key}`} value={key} />{' '}
              {PROJECT_TYPE[key]}
            </label>
          ))}
          <p className="filter-name">Payment Type</p>
          {Object.keys(PAYMENT_TYPE).map(key => (
            <label htmlFor={`payment-type-${key}`} className="filter-label">
              <input type="checkbox" id={`payment-type-${key}`} value={key} />{' '}
              {PAYMENT_TYPE[key]}
            </label>
          ))}
        </FilterContainer>
        <GigsContainer>
          {loading ? (
            <div>
              <GigCardSkeleton />
              <GigCardSkeleton />
              <GigCardSkeleton />
              <GigCardSkeleton />
            </div>
          ) : (
            <GigsList gigs={data ? data.searchGigs : []} />
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
