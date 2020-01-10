/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
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
import media from '../utils/media';
import Button from '../primitives/Button';
import { useMedia } from '../components/MediaProvider';

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
  padding: 30px 0px;
  box-sizing: border-box;
  grid-area: gigs;
`;

const FilterContainer = styled.div`
  grid-area: filter;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

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

const Filter = styled.div``;

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

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

const Gigs = ({ user }) => {
  const { size } = useMedia({}, { debounceTime: 5 });
  const isBigScreen = size === 'desktop' || size === 'giant';
  const [showFilter, setShowFilter] = useState(isBigScreen);
  const [searchVariables, setSearchVariables] = useState({
    search: '',
    first: 8,
    where: {},
  });
  const { data, loading } = useQuery(GIG_SEARCH, {
    variables: searchVariables,
  });

  useEffect(() => {
    setShowFilter(isBigScreen);
  }, [isBigScreen]);

  function renderNav() {
    if (!user) {
      return <Nav type="NOT_AUTHENTICATED" />;
    }
    return <Nav type="AUTHENTICATED_FREELANCER" user={user} />;
  }

  const handleTextSearch = debounce(val => {
    setSearchVariables(prevVal => ({ ...prevVal, search: val }));
  }, 2000);

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

      return {
        ...prevVal,
        where,
      };
    });
  };

  const handleShowMore = () =>
    setSearchVariables(prevVal => ({
      ...prevVal,
      first: prevVal.first + 8,
    }));

  return (
    <div>
      {renderNav()}
      <Container>
        <Search onSearch={handleTextSearch} />
        <FilterContainer>
          {showFilter ? (
            <>
              <Filter>
                <p className="filter-name">Job Type</p>
                <div id="filters">
                  {Object.keys(JOB_TYPE).map(key => (
                    <label
                      htmlFor={`job-type-${key}`}
                      className="filter-label"
                      key={key}
                    >
                      <input
                        type="checkbox"
                        id={`job-type-${key}`}
                        value={key}
                        onClick={e =>
                          handleFiltering(
                            'jobType_in',
                            key.toUpperCase(),
                            e.target.checked,
                          )
                        }
                      />{' '}
                      {JOB_TYPE[key]}
                    </label>
                  ))}
                </div>
              </Filter>
              <Filter>
                <p className="filter-name">Project Type</p>
                <div id="filters">
                  {Object.keys(PROJECT_TYPE).map(key => (
                    <label
                      htmlFor={`project-type-${key}`}
                      className="filter-label"
                      key={key}
                    >
                      <input
                        type="checkbox"
                        id={`project-type-${key}`}
                        value={key}
                        onClick={e =>
                          handleFiltering(
                            'projectType_in',
                            key.toUpperCase(),
                            e.target.checked,
                          )
                        }
                      />{' '}
                      {PROJECT_TYPE[key]}
                    </label>
                  ))}
                </div>
              </Filter>
              <Filter>
                <p className="filter-name">Payment Type</p>
                <div className="filters">
                  {Object.keys(PAYMENT_TYPE).map(key => (
                    <label
                      htmlFor={`payment-type-${key}`}
                      className="filter-label"
                      key={key}
                    >
                      <input
                        type="checkbox"
                        id={`payment-type-${key}`}
                        value={key}
                        onClick={e =>
                          handleFiltering(
                            'paymentType_in',
                            key.toUpperCase(),
                            e.target.checked,
                          )
                        }
                      />{' '}
                      {PAYMENT_TYPE[key]}
                    </label>
                  ))}
                </div>
              </Filter>
              {!isBigScreen && (
                <Button onClick={() => setShowFilter(!showFilter)}>
                  Hide Filter
                </Button>
              )}
            </>
          ) : (
            <Button onClick={() => setShowFilter(!showFilter)}>
              Show Filters
            </Button>
          )}
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
            <>
              <GigsList gigs={data ? data.searchGigs : []} />
              <Button onClick={handleShowMore}>Show More</Button>
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
