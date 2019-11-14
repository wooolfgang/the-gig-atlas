import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import ArrowUp from '../../icons/ArrowUp';
import { ThreadLinkContainer } from './style';
import Avatar from '../../primitives/Avatar';

const ThreadLink = ({ thread }) => (
  <ThreadLinkContainer key={thread.id}>
    <div id="upvote-count-container">
      <ArrowUp
        height="25"
        width="25"
        viewBox="0 0 25 25"
        style={{ cursor: 'pointer' }}
      />
      <div id="upvote-count">{thread.upvoteCount}</div>
    </div>
    <div
      style={{ display: 'flex', flexDirection: 'column' }}
      onClick={() => Router.push(`/thread/${thread.id}`)}
      tabIndex={0}
      role="button"
      onKeyPress={() => {}}
      onKeyDown={() => {}}
      onKeyUp={() => {}}
      id="thread-link"
    >
      <a id="thread-title" href={`/thread/${thread.id}`}>
        {thread.title}
      </a>
      <div id="thread-lower">
        <span>by {thread.postedBy.firstName}</span>
        <span>{thread.commentCount} comments</span>
        <a>Join discussion -></a>
      </div>
    </div>
    <div style={{ display: 'flex' }}>
      {thread.posters.map(poster => (
        <Avatar
          src={poster.avatar && poster.avatar.url}
          style={{ width: '25px', height: '25px' }}
          key={poster.id}
        />
      ))}
    </div>
  </ThreadLinkContainer>
);

ThreadLink.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    postedBy: PropTypes.object,
    commentCount: PropTypes.number,
    upvoteCount: PropTypes.number,
    posters: PropTypes.array,
  }).isRequired,
};

export default ThreadLink;
