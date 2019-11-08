import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CommentTextArea from '../CommentTextArea';

const CommentContainer = styled.div`
  margin-left: ${props => `${props.nestLevel * 22}px`};
  margin-bottom: 12px;
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

const Comment = ({ comment, threadId, nestLevel = 0 }) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [childrenComments, setChildrenComments] = useState(
    comment.children || [],
  );

  return (
    <>
      <CommentContainer nestLevel={nestLevel}>
        <div>
          <User>[-] {comment.postedBy.firstName}</User>
          <div dangerouslySetInnerHTML={{ __html: comment.text }} />
        </div>
        <ReplyButton
          type="button"
          onClick={() => setShowTextArea(!showTextArea)}
        >
          {showTextArea ? 'Hide' : 'Reply'}
        </ReplyButton>
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
      </CommentContainer>
      {childrenComments.map(child => (
        <Comment
          comment={child}
          threadId={threadId}
          key={child.id}
          nestLevel={nestLevel + 1}
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
