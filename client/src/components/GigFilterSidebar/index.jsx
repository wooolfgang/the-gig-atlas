import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { JOB_TYPE, PROJECT_TYPE, PAYMENT_TYPE } from '../../utils/constants';
import { useMedia } from '../MediaProvider';
import Button from '../../primitives/Button';
import { Filter, FilterContainer } from './style';

const GigFilterSidebar = ({ handleFiltering }) => {
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

GigFilterSidebar.propTypes = {
  handleFiltering: PropTypes.func.isRequired,
};

export default GigFilterSidebar;
