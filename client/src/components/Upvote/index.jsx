import React from 'react';
import PropTypes from 'prop-types';
import ArrowUp from '../../icons/ArrowUp';
import { UpvoteContainer, UpvoteCount } from './style';
import noop from '../../utils/noop';

const Upvote = ({ onUpvote, hasUserUpvoted, upvoteCount }) => (
  <UpvoteContainer
    type="button"
    onClick={onUpvote}
    hasUserUpvoted={hasUserUpvoted}
    disabled={hasUserUpvoted}
  >
    <ArrowUp height="22" width="22" viewBox="0 0 22 22" />
    <UpvoteCount>{upvoteCount}</UpvoteCount>
  </UpvoteContainer>
);

Upvote.propTypes = {
  upvoteCount: PropTypes.number.isRequired,
  onUpvote: PropTypes.func,
  hasUserUpvoted: PropTypes.bool,
};

Upvote.defaultProps = {
  onUpvote: noop,
  hasUserUpvoted: false,
};

export default Upvote;
