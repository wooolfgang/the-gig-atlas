import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
    '. main side .'
    '. . . . ';
  grid-template-rows: 1rem 1fr 1rem;
  grid-template-columns: 1fr 65vw 20vw 1fr;
`;

const TagsContainer = styled.div``;

const ThreadTagLink = styled.button`
  margin: 2px 4px;
  font-size: 0.9rem;
  color: ${props => props.theme.color.d3};
  cursor: pointer;
  padding: 2px 4px;
  box-sizing: border-box;
  border-radius: 2px;
  transition: all 100ms ease-out;
  outline: none;
  border: none;

  &:hover {
    font-weight: bold;
  }

  ${props =>
    props.active &&
    `
    font-weight: bold;
  `}
`;

const ThreadContainer = styled.div`
  margin-top: 1.8rem;
`;

const Main = styled.div`
  grid-area: main;
`;

const Side = styled.div`
  grid-area: side;
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
  const router = useRouter();

  const { data: threads } = useQuery(GET_THREADS, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        tags_some: router.query.tag && {
          name: router.query.tag,
        },
      },
    },
  });
  const { data: threadTags } = useQuery(GET_THREAD_TAGS);
  const { data: newestFreelancers } = useQuery(GET_NEWEST_FREELANCERS, {
    fetchPolicy: 'network-only',
  });

  const handleRouteQueryChange = newQuery => {
    const updatedQuery = { ...router.query, ...newQuery };
    const { pathname } = router;
    router.push({
      pathname,
      query: updatedQuery,
    });
  };

  return (
    <div>
      <Nav type="AUTHENTICATED_FREELANCER" />
      <Container>
        <Main>
          <TagsContainer>
            <ThreadTagLink
              key="show-all-thread-tag"
              id="thread-tag"
              type="button"
              active={router.pathname === '/' && !router.query.tag}
              onClick={() => router.push('/')}
            >
              Show All
            </ThreadTagLink>
            {threadTags &&
              threadTags.threadTags.map(tag => (
                <ThreadTagLink
                  id="thread-tag"
                  key={tag.id}
                  onClick={() => handleRouteQueryChange({ tag: tag.name })}
                  type="button"
                  active={router.query.tag && router.query.tag === tag.name}
                >
                  #{tag.name}{' '}
                </ThreadTagLink>
              ))}
          </TagsContainer>
          <ThreadContainer>
            {threads && (
              <>
                {threads.threads.map(thread => (
                  <ThreadLink thread={thread} key={thread.id} />
                ))}
                {threads.threads.length < 12 && (
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
        <Side>
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
        </Side>
      </Container>
    </div>
  );
};

export default Authenticated;
