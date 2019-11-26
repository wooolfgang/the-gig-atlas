import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import ArrowUp from '../../icons/ArrowUp';
import { UpvoteContainer, UpvoteCount } from './style';
import { UPVOTE_THREAD } from '../../graphql/thread';

const UpvoteThread = ({ upvoteCount, threadId, hasUserUpvoted }) => {
  const [upvoteThread] = useMutation(UPVOTE_THREAD, {
    variables: {
      threadId,
    },
  });

  return (
    <UpvoteContainer
      type="button"
      onClick={upvoteThread}
      hasUserUpvoted={hasUserUpvoted}
      disabled={hasUserUpvoted}
    >
      <ArrowUp height="22" width="22" viewBox="0 0 22 22" />
      <UpvoteCount>{upvoteCount}</UpvoteCount>
    </UpvoteContainer>
  );
};

UpvoteThread.propTypes = {
  upvoteCount: PropTypes.number.isRequired,
  threadId: PropTypes.string.isRequired,
  hasUserUpvoted: PropTypes.bool,
};

UpvoteThread.defaultProps = {
  hasUserUpvoted: false,
};

export default UpvoteThread;
