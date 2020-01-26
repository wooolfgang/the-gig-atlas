import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { JOB_TYPE, PROJECT_TYPE, PAYMENT_TYPE } from '../../utils/constants';
import { useMedia } from '../MediaProvider';
import Button from '../../primitives/Button';

const Filter = styled.div``;

// eslint-disable-next-line react/prop-types

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

// eslint-disable-next-line react/prop-types
const FilterSidebar = ({ handleFiltering }) => {
  const { size } = useMedia({}, { debounceTime: 5 });
  const isBigScreen = size === 'desktop' || size === 'giant';
  const [showFilter, setShowFilter] = useState(isBigScreen);

  useEffect(() => {
    setShowFilter(isBigScreen);
  }, [isBigScreen]);

  return (
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
                        'jobs',
                        key.toUpperCase(),
                        e.target.checked,
                      )}
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
                        'projects',
                        key.toUpperCase(),
                        e.target.checked,
                      )}
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
                    id={`payments${key}`}
                    value={key}
                    onClick={e =>
                      handleFiltering(
                        'payments',
                        key.toUpperCase(),
                        e.target.checked,
                      )}
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
        <Button onClick={() => setShowFilter(!showFilter)}>Show Filters</Button>
      )}
    </FilterContainer>
  );
};

export default FilterSidebar;
