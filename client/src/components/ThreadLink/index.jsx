import React, { useState } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import ArrowUp from '../../icons/ArrowUp';
import ArrowRightSimple from '../../icons/ArrowRightSimple';
import {
  ThreadLinkContainer,
  ThreadLinkContainerSkeleton,
  UpvoteContainer,
  ArrowRightContainer,
} from './style';
import { color } from '../../utils/theme';
import AvatarUserDropdown from '../AvatarUserDropdown';

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

const ArrowUpButton = () => {
  const [fill, setFill] = useState(color.neutral50);

  const handleMouseEnter = () => {
    setFill(color.neutral80);
  };

  const handleMouseLeave = () => {
    setFill(color.neutral50);
  };

  return (
    <ArrowUp
      height="22"
      width="22"
      viewBox="0 0 22 22"
      fill={fill}
      style={{ cursor: 'pointer' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

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

const ThreadLink = ({ thread, loading }) => {
  if (loading) {
    return <ThreadLinkSkeleton />;
  }

  return (
    <ThreadLinkContainer key={thread.id}>
      <UpvoteContainer>
        <ArrowUpButton />
        <div id="upvote-count">{thread.upvoteCount}</div>
      </UpvoteContainer>
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
  }).isRequired,
  loading: PropTypes.bool,
};

ThreadLink.defaultProps = {
  loading: false,
};

export default ThreadLink;
