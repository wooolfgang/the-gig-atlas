import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { GET_THREADS, GET_THREAD_TAGS } from '../../graphql/thread';
import { GET_NEWEST_FREELANCERS } from '../../graphql/freelancer';
import { Button, Spinner, OldSchoolLink } from '../../primitives';
import ThreadLink from '../ThreadLink';
import RequireAuthenticated from '../RequireAuthenticated';
import AvatarUserDropdown from '../AvatarUserDropdown';
import { color } from '../../utils/theme';
import ListEmpty from '../../icons/ListEmpty';
import Working from '../../icons/Working';
import {
  Container,
  TagsContainer,
  ThreadContainer,
  Main,
  Side,
  CollabContainer,
  PaginationContainer,
  PaginationLink,
  ThreadCreateLink,
} from './style';
import { propTypes } from '../../utils/globals';

const Community = ({ user, router }) => {
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
  const { data: tags } = useQuery(GET_THREAD_TAGS);
  const {
    data: newestFreelancers,
    loading: newestFreelancersLoading,
  } = useQuery(GET_NEWEST_FREELANCERS, {
    fetchPolicy: 'network-only',
  });
  return (
    <Container>
      <Main>
        <TagsContainer>
          <Link href={router.pathname} passHref>
            <OldSchoolLink
              key="show-all-thread-tag"
              active={
                (router.pathname === '/' || router.pathname === '/community') &&
                !router.query.tag
              }
            >
              Show All
            </OldSchoolLink>
          </Link>
          {tags &&
            tags.tags.map(tag => (
              <Link
                href={{
                  pathname: router.pathname,
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
            [{}, {}, {}, {}, {}].map((_, i) => <ThreadLink loading key={i} />)}
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
                <ThreadLink
                  thread={thread}
                  key={thread.id}
                  userId={user && user.id}
                />
              ))}
              {threads.threads.length < pagination && (
                <RequireAuthenticated isAuthenticated={!!user}>
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
                </RequireAuthenticated>
              )}
              <PaginationContainer>
                {router.query.page > 0 && (
                  <Link
                    passHref
                    href={{
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        page:
                          Number(router.query.page ? router.query.page : 0) - 1,
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
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        page:
                          Number(router.query.page ? router.query.page : 0) + 1,
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
                  }}
                >
                  Our Recent Members
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
  );
};

Community.propTypes = {
  user: propTypes.user,
  router: PropTypes.shape({
    query: {
      page: PropTypes.number,
      tag: PropTypes.string,
    },
    pathname: PropTypes.string,
  }).isRequired,
};

Community.defaultProps = {
  user: null,
};

export default withRouter(Community);
