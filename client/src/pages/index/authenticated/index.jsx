import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Nav from '../../../components/Nav';
import { GET_THREADS, GET_THREAD_TAGS } from '../../../graphql/thread';
import { GET_NEWEST_FREELANCERS } from '../../../graphql/freelancer';
import { Button, Spinner, OldSchoolLink } from '../../../primitives';
import ThreadLink from '../../../components/ThreadLink';
import AvatarUserDropdown from '../../../components/AvatarUserDropdown';
import { color } from '../../../utils/theme';
import ListEmpty from '../../../icons/ListEmpty';
import Working from '../../../icons/Working';
import media from '../../../utils/media';

const Container = styled.div`
  box-sizing: border-box;
  box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.05);
  padding-top: 2rem;
  display: grid;
  min-height: calc(100vh - 67.5px);
  grid-template-areas:
    '. . . .'
    '. main side .'
    '. . . .';
  grid-template-rows: 1rem 1fr 1rem;
  grid-template-columns: 1fr 65vw 21vw 1fr;

  ${media.tablet`
    grid-template-areas:
      '. . .'
      '. main .'
      '. side .';
    grid-template-rows: 1rem 1fr 1rem;
    grid-template-columns: 1fr 100vw 1fr;
  `}
`;

const TagsContainer = styled.div`
  display: flex;
  max-width: 100vw;
  overflow: auto;
  box-sizing: border-box;
`;

const ThreadContainer = styled.div`
  margin-top: 1.8rem;
`;

const Main = styled.main`
  grid-area: main;
  padding-right: 2rem;
  box-sizing: border-box;
`;

const Side = styled.div`
  grid-area: side;
`;

const CollabContainer = styled.div`
  background: ${props => props.theme.color.d5};
  box-shadow: inset
  height: 376px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: center;

  #top-header {
    padding: 1rem .75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    background-color: ${props => props.theme.color.d5};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='blue' fill-opacity='0.10' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
    transition: all 100ms ease-in-out;

    :hover {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='blue' fill-opacity='0.30' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
    }

    span {
      padding: 0px 2px;
      display: block;
      margin-bottom: 3px;
      color: ${props => props.theme.color.d2};
      border-radius: 2px;
    }    
  }

  #newest-freelancers {
    padding-top: 1rem;
    padding-left: 1.8rem;
    box-shadow: inset 0 0 20px white;
    box-sizing: border-box;
    background: ${props => props.theme.color.d6};
    width: 100%;
    height: 100%;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PaginationLink = styled.a`
  text-decoration: none;
  font-size: 0.8rem;
  margin-left: 4px;
  color: ${props => props.theme.color.d3};

  :hover,
  :focus {
    color: ${props => props.theme.color.d2};
  }
`;

const ThreadCreateLink = styled.a`
  text-decoration: none;
  padding: 1rem 1rem;
  border: 1px dashed ${props => props.theme.color.neutral20};
  display: inline-block;
  transition: 100ms;
  outline: none;

  :hover,
  :focus {
    border: 1px dashed ${props => props.theme.color.neutral40};
  }
`;

const Authenticated = ({ authenticatedUser }) => {
  const router = useRouter();
  const pagination = 8;

  const { data: threads, loading } = useQuery(GET_THREADS, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        tags_some: router.query.tag && {
          name: router.query.tag,
        },
      },
      first: pagination,
      skip: router.query.page ? router.query.page * pagination : 0,
    },
  });
  const { data: threadTags } = useQuery(GET_THREAD_TAGS);
  const {
    data: newestFreelancers,
    loading: newestFreelancersLoading,
  } = useQuery(GET_NEWEST_FREELANCERS, {
    fetchPolicy: 'network-only',
  });

  return (
    <>
      <Nav type="AUTHENTICATED_FREELANCER" user={authenticatedUser} />
      <Container>
        <Main>
          <TagsContainer>
            <Link href="/" passHref>
              <OldSchoolLink
                key="show-all-thread-tag"
                active={router.pathname === '/' && !router.query.tag}
              >
                Show All
              </OldSchoolLink>
            </Link>
            {threadTags &&
              threadTags.threadTags.map(tag => (
                <Link
                  href={{
                    pathname: '/',
                    query: {
                      ...router.query,

                      tag: tag.name,
                    },
                  }}
                  passHref
                  key={tag.id}
                >
                  <OldSchoolLink
                    key={tag.id}
                    active={router.query.tag && router.query.tag === tag.name}
                  >
                    #{tag.name}{' '}
                  </OldSchoolLink>
                </Link>
              ))}
          </TagsContainer>
          <ThreadContainer>
            {loading &&
              [{}, {}, {}, {}, {}].map((_, i) => (
                <ThreadLink loading key={i} />
              ))}
            {threads && threads.threads.length === 0 && !loading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '400px',
                  paddingBottom: '2rem',
                  paddingTop: '.5rem',
                }}
              >
                <p
                  style={{
                    color: color.neutral70,
                    fontStyle: 'italic',
                    margin: '0px',
                  }}
                >
                  No threads found for this topic yet.
                </p>
                <ListEmpty width="175" height="175" viewBox="0 0 2700 2700" />
              </div>
            )}
            {threads && (
              <>
                {threads.threads.map(thread => (
                  <ThreadLink thread={thread} key={thread.id} />
                ))}
                {threads.threads.length < pagination && (
                  <Link href="/thread/create">
                    <ThreadCreateLink href="/thread/create">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Working
                          width="80"
                          viewBox="100 100 1000 450"
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '1rem',
                              color: color.s1,
                            }}
                          >
                            Want to discuss something with fellow freelancers?
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '1rem',
                              color: color.s1,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {' '}
                            Create a thread ->
                          </p>
                        </div>
                      </div>
                    </ThreadCreateLink>
                  </Link>
                )}
                <PaginationContainer>
                  {router.query.page > 0 && (
                    <Link
                      passHref
                      href={{
                        pathname: '/',
                        query: {
                          ...router.query,
                          page:
                            Number(router.query.page ? router.query.page : 0) -
                            1,
                        },
                      }}
                    >
                      <PaginationLink>{'<-'} Previous Page </PaginationLink>
                    </Link>
                  )}
                  {threads.threads.length === pagination && (
                    <Link
                      passHref
                      href={{
                        pathname: '/',
                        query: {
                          ...router.query,
                          page:
                            Number(router.query.page ? router.query.page : 0) +
                            1,
                        },
                      }}
                    >
                      <PaginationLink>Next Page -></PaginationLink>
                    </Link>
                  )}
                </PaginationContainer>
              </>
            )}
          </ThreadContainer>
        </Main>
        <Side>
          <CollabContainer>
            {newestFreelancersLoading ? (
              <div style={{ margin: 'auto' }}>
                <Spinner width="30" height="30" viewBox="0 0 50 50" />
              </div>
            ) : (
              <>
                <div id="top-header">
                  <span
                    style={{
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    Group Pomodoro Sessions
                    <span role="img" aria-label="celebrate-emoji">
                      🎉🙌🥳
                    </span>
                  </span>
                  <Button
                    style={{
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      color: color.neutral70,
                      width: '125px',
                      padding: '.5rem .75rem',
                    }}
                  >
                    Join Them
                  </Button>
                </div>
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
                        <AvatarUserDropdown
                          src={freelancer.avatar && freelancer.avatar.url}
                          userId={freelancer.asUser && freelancer.asUser.id}
                          avatarStyle={{
                            width: '36px',
                            height: '36px',
                            marginRight: '.5rem',
                            display: 'block',
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '.95rem',
                              marginBottom: '2px',
                              height: '1.2rem',
                              lineHeight: '1.2rem',
                              overflow: 'hidden',
                            }}
                          >
                            {freelancer.asUser.firstName}{' '}
                            {freelancer.asUser.lastName}
                          </span>
                          <span
                            style={{
                              fontSize: '.8rem',
                              color: color.neutral50,
                            }}
                          >
                            Fullstack Developer
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </CollabContainer>
        </Side>
      </Container>
    </>
  );
};

Authenticated.propTypes = {
  authenticatedUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isEmailVerified: PropTypes.bool,
    avatar: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
    }),
  }).isRequired,
};

export default Authenticated;
