/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import CommentTextArea from '../CommentTextArea';
import Avatar from '../../primitives/Avatar';
import Upvote from '../Upvote';
import { UPVOTE_COMMENT } from '../../graphql/thread';

const CommentContainer = styled.div`
  margin-left: ${props => `${props.nestLevel * 22}px`};
  margin-bottom: 12px;
  display: flex;
`;

const CommentBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  max-width: 100vw;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.color.neutral60};

  :hover,
  :focus {
    color: ${props => props.theme.color.neutral80};
    outline: none;
  }
`;

const User = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.color.d3};
`;

const UpvoteComment = ({
  commentId,
  hasUserUpvoted,
  upvoteCount,
  setComment,
}) => {
  const [upvoteComment] = useMutation(UPVOTE_COMMENT, {
    variables: {
      commentId,
    },
  });
  return (
    <Upvote
      onUpvote={async () => {
        try {
          const res = await upvoteComment();
          if (res.data) {
            setComment(comment => ({
              ...comment,
              upvoteCount: res.data.upvoteComment.upvoteCount,
              votes: res.data.upvoteComment.votes,
            }));
          }
        } catch (e) {
          console.log(e);
        }
      }}
      hasUserUpvoted={hasUserUpvoted}
      upvoteCount={upvoteCount}
    />
  );
};

const Comment = ({ comment: _comment, threadId, nestLevel = 0, userId }) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [comment, setComment] = useState(_comment);
  const [childrenComments, setChildrenComments] = useState(
    (comment && comment.children) || [],
  );

  return (
    <>
      <CommentContainer nestLevel={nestLevel}>
        <UpvoteComment
          commentId={comment.id}
          upvoteCount={comment.upvoteCount}
          hasUserUpvoted={
            comment.votes.filter(vote => vote.user && vote.user.id === userId)
              .length > 0
          }
          setComment={setComment}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            {comment.postedBy && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={comment.postedBy.avatar && comment.postedBy.avatar.url}
                  style={{
                    width: '28px',
                    height: '28px',
                    marginRight: '5px',
                  }}
                />
                <User>[-] {comment.postedBy.firstName}</User>
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: comment.text }} />
          </div>
          <div>
            <ReplyButton
              type="button"
              onClick={() => setShowTextArea(!showTextArea)}
            >
              {showTextArea ? 'Hide' : 'Reply'}
            </ReplyButton>
          </div>
          {showTextArea && (
            <CommentBoxContainer>
              <CommentTextArea
                threadId={threadId}
                parentId={comment.id}
                onSubmit={newComment => {
                  setChildrenComments(comments => [newComment, ...comments]);
                  setShowTextArea(false);
                }}
              />
            </CommentBoxContainer>
          )}
        </div>
      </CommentContainer>
      {childrenComments.map(child => (
        <Comment
          comment={child}
          threadId={threadId}
          key={child.id}
          nestLevel={nestLevel + 1}
          userId={userId}
        />
      ))}
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape),
    parent: Comment.propTypes,
  }).isRequired,
  threadId: PropTypes.string.isRequired,
  nestLevel: PropTypes.number,
};

Comment.defaultProps = {
  nestLevel: 0,
};

export default Comment;
