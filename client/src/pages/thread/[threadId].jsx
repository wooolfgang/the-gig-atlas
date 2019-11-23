import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import Nav from '../../components/Nav';
import { GET_THREAD } from '../../graphql/thread';
import Comment from '../../components/Comment';
import CommentTextArea from '../../components/CommentTextArea';
import withAuthSync from '../../components/withAuthSync';

const PageContainer = styled.div`
  min-height: calc(100vh - 67.5px);
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.05);
`;

const ThreadContainer = styled.div`
  width: 800px;
  max-width: 100vw;
  padding: 1.5rem 0.5rem;
  box-sizing: border-box;
  padding-left: 7.5rem;

  #thread-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  #thread-body {
    border: 1px solid ${props => props.theme.color.p3};
    background: ${props => props.theme.color.d6};
    padding: 0.75rem 1rem;
    box-sizing: border-box;
    border-radius: 2px;
    font-size: 0.95rem;
  }
`;

const CommentBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 650px;
  max-width: 100vw;
`;

const CommentTreeContainer = styled.div`
  padding: 2rem 0rem;
  box-sizing: border-box;
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

const ParentCommentTextArea = ({ threadId, setParentComments }) => {
  const [showTextArea, setShowTextArea] = useState(false);
  return (
    <>
      <div>
        <ReplyButton
          type="button"
          onClick={() => setShowTextArea(show => !show)}
        >
          {showTextArea ? 'Hide' : 'Reply to thread '}
        </ReplyButton>
      </div>

      {showTextArea && (
        <CommentBoxContainer>
          <CommentTextArea
            threadId={threadId}
            onSubmit={comment => {
              setParentComments(parentComments => [comment, ...parentComments]);
              setShowTextArea(false);
            }}
          />
        </CommentBoxContainer>
      )}
    </>
  );
};

ParentCommentTextArea.propTypes = {
  threadId: PropTypes.string.isRequired,
  setParentComments: PropTypes.func.isRequired,
};

const Thread = ({ user }) => {
  const router = useRouter();
  const { threadId } = router.query;
  const { data } = useQuery(GET_THREAD, {
    variables: {
      where: {
        id: threadId,
      },
    },
    fetchPolicy: 'network-only',
  });

  const [parentComments, setParentComments] = useState([]);

  useEffect(() => {
    if (data && data.thread && data.thread.commentTree) {
      setParentComments(data.thread.commentTree);
    }
  }, [data]);

  return (
    <>
      <Nav type="AUTHENTICATED_FREELANCER" user={user} />
      <PageContainer>
        <ThreadContainer>
          <Link href="/">
            <a
              href="/"
              style={{
                textDecoration: 'none',
                fontSize: '.8rem',
              }}
            >
              {'<- Return to home'}
            </a>
          </Link>
          {data && data.thread && (
            <div>
              <h1 id="thread-title">{data.thread.title}</h1>
            </div>
          )}
          <div
            id="thread-body"
            dangerouslySetInnerHTML={{ __html: data && data.thread.body }}
          />
          <ParentCommentTextArea
            threadId={threadId}
            setParentComments={setParentComments}
            thread={data && data.thread}
          />
          <CommentTreeContainer>
            {parentComments &&
              parentComments.map(comment => (
                <Comment
                  comment={comment}
                  threadId={threadId}
                  key={comment.id}
                />
              ))}
          </CommentTreeContainer>
        </ThreadContainer>
      </PageContainer>
    </>
  );
};

export default withAuthSync(Thread, 'all');
