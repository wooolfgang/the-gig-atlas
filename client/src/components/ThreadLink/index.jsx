import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import ArrowRightSimple from '../../icons/ArrowRightSimple';
import {
  ThreadLinkContainer,
  ThreadLinkContainerSkeleton,
  UpvoteContainer,
  ArrowRightContainer,
} from './style';
import AvatarUserDropdown from '../AvatarUserDropdown';
import Upvote from '../Upvote';
import { UPVOTE_THREAD } from '../../graphql/thread';

// eslint-disable-next-line react/prop-types
const UpvoteThread = ({ threadId, upvoteCount, hasUserUpvoted }) => {
  const [upvoteThread] = useMutation(UPVOTE_THREAD, {
    variables: {
      threadId,
    },
  });
  return (
    <Upvote
      onUpvote={upvoteThread}
      threadId={threadId}
      hasUserUpvoted={hasUserUpvoted}
      upvoteCount={upvoteCount}
    />
  );
};

const ArrowRightSimpleAnimated = () => (
  <ArrowRightContainer id="arrow-right-animated">
    <ArrowRightSimple
      width="24"
      height="18"
      viewBox="0 0 32 20"
      preserveAspectRatio="xMidYMid meet"
      style={{ marginLeft: '2px' }}
    />
  </ArrowRightContainer>
);

const ThreadLinkSkeleton = () => (
  <ThreadLinkContainerSkeleton>
    <UpvoteContainer>
      <div id="upvote-count" />
    </UpvoteContainer>
    <div id="thread-link">
      <div id="thread-title" />
      <div id="thread-lower">
        <div />
        <div />
        <div />
      </div>
    </div>
  </ThreadLinkContainerSkeleton>
);

const ThreadLink = ({ thread, loading, userId }) => {
  if (loading) {
    return <ThreadLinkSkeleton />;
  }

  return (
    <ThreadLinkContainer key={thread.id}>
      <UpvoteThread
        threadId={thread.id}
        upvoteCount={thread ? thread.upvoteCount : 0}
        hasUserUpvoted={
          thread.votes.filter(vote => vote.user.id && vote.user.id === userId)
            .length > 0
        }
      />
      <div
        style={{ display: 'flex', flexDirection: 'column' }}
        onClick={() => Router.push(`/thread/${thread.id}`)}
        tabIndex={0}
        role="button"
        onKeyPress={() => Router.push(`/thread/${thread.id}`)}
        id="thread-link"
      >
        <h2 id="thread-title">{thread.title}</h2>
        <div>
          <div style={{ display: 'inline-block' }}>
            <div id="thread-lower">
              <span>by {thread.postedBy.firstName}</span>
              <span>{thread.commentCount} comments</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Join discussion <ArrowRightSimpleAnimated />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {thread.posters.map(poster => (
          <div key={poster.id}>
            <AvatarUserDropdown
              src={poster.avatar && poster.avatar.url}
              avatarStyle={{ width: '25px', height: '25px' }}
              userId={poster.id}
            />
          </div>
        ))}
      </div>
    </ThreadLinkContainer>
  );
};

ThreadLink.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    postedBy: PropTypes.object,
    commentCount: PropTypes.number,
    upvoteCount: PropTypes.number,
    posters: PropTypes.array,
    votes: PropTypes.array,
  }).isRequired,
  loading: PropTypes.bool,
  userId: PropTypes.string,
};

ThreadLink.defaultProps = {
  loading: false,
  userId: null,
};

export default ThreadLink;
