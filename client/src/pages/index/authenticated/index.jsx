import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useQuery } from '@apollo/react-hooks';
import Nav from '../../../components/Nav';
import { GET_THREADS, GET_THREAD_TAGS } from '../../../graphql/thread';
import { GET_NEWEST_FREELANCERS } from '../../../graphql/freelancer';
import Avatar from '../../../primitives/Avatar';
import ThreadLink from '../../../components/ThreadLink';
import { color } from '../../../utils/theme';

const Container = styled.div`
  box-sizing: border-box;
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.05);
  margin: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: grid;
  min-height: calc(100vh - 67.5px);
  grid-template-areas:
    '. . . . '
    '. main sidebar .'
    '. . . . ';
  grid-template-rows: 1rem 1fr 1rem;
  grid-template-columns: 1fr 65vw 20vw 1fr;
`;

const TagsContainer = styled.div`
  #thread-tag {
    margin: 2px 4px;
    font-size: 0.9rem;
    color: ${props => props.theme.color.d3};
    cursor: pointer;
    padding: 2px 4px;
    box-sizing: border-box;
    border-radius: 2px;
    transition: all 100ms ease-out;

    &:hover {
      background: ${props => props.theme.color.neutral5};
      color: ${props => props.theme.color.d2};
    }
  }
`;

const ThreadContainer = styled.div`
  margin-top: 1.8rem;
`;

const Main = styled.div`
  grid-area: main;
`;

const Sidebar = styled.div`
  grid-area: sidebar;
`;
const CollabContainer = styled.div`
  background: ${props => props.theme.color.d5};
  height: 376px;
  border-radius: 2px;
  padding: 1rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: center;

  #newest-freelancers {
    padding: 1.2rem 0.5rem;
    box-sizing: border-box;
  }
`;

const Authenticated = () => {
  const { data: threads } = useQuery(GET_THREADS, {
    fetchPolicy: 'network-only',
  });
  const { data: threadTags } = useQuery(GET_THREAD_TAGS);
  const { data: newestFreelancers } = useQuery(GET_NEWEST_FREELANCERS, {
    fetchPolicy: 'network-only',
  });
  return (
    <div>
      <Nav type="AUTHENTICATED_FREELANCER" />
      <Container>
        <Main>
          <TagsContainer>
            <span id="thread-tag">Show All</span>
            {threadTags &&
              threadTags.threadTags.map(tag => (
                <span id="thread-tag" key={tag}>
                  #{tag.toLowerCase()}{' '}
                </span>
              ))}
          </TagsContainer>
          <ThreadContainer>
            {threads && (
              <>
                {threads.threads.map(thread => (
                  <ThreadLink thread={thread} key={thread.id} />
                ))}
                {threads.threads.length < 4 && (
                  <div style={{ padding: '1rem .5rem' }}>
                    <Link href="/thread/create">
                      <a
                        href="/thread/create"
                        style={{ textDecoration: 'none' }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            color: color.s1,
                          }}
                        >
                          This could be your post! Have something in mind?
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            color: color.s1,
                          }}
                        >
                          {' '}
                          Create a discussion now ->
                        </p>
                      </a>
                    </Link>
                  </div>
                )}
              </>
            )}
          </ThreadContainer>
        </Main>
        <Sidebar>
          <CollabContainer>
            <span
              style={{
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 400,
                marginBottom: '.5rem',
              }}
            >
              Looking to collaborate?
              <span role="img" aria-label="people-emoji">
                🧑🏽‍🤝‍🧑🏻
              </span>
            </span>
            <span
              style={{
                textAlign: 'center',
                fontSize: '0.9rem',
                color: color.neutral70,
              }}
            >
              Check out new members of our freelancer community!
            </span>
            <div id="newest-freelancers">
              {newestFreelancers &&
                newestFreelancers.freelancers.map(freelancer => (
                  <div
                    key={freelancer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '.85rem',
                    }}
                  >
                    <Avatar
                      src={freelancer.avatar.url}
                      style={{
                        width: '36px',
                        height: '36px',
                        marginRight: '.5rem',
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>
                        {freelancer.asUser.firstName}{' '}
                        {freelancer.asUser.lastName}
                      </span>
                      <span style={{ fontSize: '.85rem' }}>
                        Fullstack Developer
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CollabContainer>
        </Sidebar>
      </Container>
    </div>
  );
};

export default Authenticated;
