import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { color } from '../../utils/theme';
import SearchIcon from '../../icons/Search';
import { SearchContainer, SearchInput } from './style';

const GigSearch = ({ onSearch, router }) => {
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
        onKeyPress={e => e.key === 'Enter' && onSearch(e.target.value)}
      />
      <SearchIcon style={{ padding: '0 .5rem' }} fill={color.d4} />
    </SearchContainer>
  );
};

GigSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  router: PropTypes.shape({
    query: {
      focused: PropTypes.bool,
    },
  }).isRequired,
};

export default withRouter(GigSearch);
