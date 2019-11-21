import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER_FREELANCER_PROFILE } from '../../graphql/user';
import { Avatar, Spinner, OldSchoolLink } from '../../primitives';
import {
  Container,
  Skill,
  PortfolioContainer,
  ProjectCard,
  ProjectImage,
} from './style';
import { color } from '../../utils/theme';

const FreelancerProfile = ({ userId }) => {
  const { data, loading } = useQuery(GET_USER_FREELANCER_PROFILE, {
    variables: {
      where: {
        id: userId,
      },
    },
  });

  if (!loading && !data) {
    return (
      <span style={{ margin: 'auto' }}>
        This user does not seem to exist{' '}
        <span role="img" aria-label="spook-emoji">
          😱
        </span>
      </span>
    );
  }

  if (data && data.getUser.accountType !== 'FREELANCER') {
    return Router.back();
  }

  return (
    <Container>
      {loading ? (
        <div style={{ display: 'flex' }}>
          Loading user data...
          <Spinner />
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              padding: '1rem 0',
              boxSizing: 'border-box',
            }}
          >
            <Avatar
              src={
                data.getUser && data.getUser.avatar && data.getUser.avatar.url
              }
            />
            <div
              style={{
                marginLeft: '1rem',
              }}
            >
              <h1 style={{ marginBottom: '.5rem' }}>
                {data.getUser.firstName} {data.getUser.lastName}
              </h1>
              <span style={{ marginBottom: '.5rem', display: 'block' }}>
                {data.getUser.bio || <i>This user has no bio yet</i>}
              </span>
              <div style={{ display: 'flex' }}>
                {data.getUser.asFreelancer.skills &&
                  data.getUser.asFreelancer.skills.map(skill => (
                    <Skill key={skill}>{skill}</Skill>
                  ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <Link href={`/user/${userId}`}>
              <OldSchoolLink href={`/user/${userId}`} active>
                Projects
              </OldSchoolLink>
            </Link>
            <Link href={`/user/${userId}`}>
              <OldSchoolLink href={`/user/${userId}`}>Threads</OldSchoolLink>
            </Link>
            <Link href={`/user/${userId}`}>
              <OldSchoolLink href={`/user/${userId}`}>Comments</OldSchoolLink>
            </Link>
          </div>
          <PortfolioContainer>
            {data.getUser.asFreelancer.portfolio &&
              data.getUser.asFreelancer.portfolio.map(project => (
                <ProjectCard key={project.id}>
                  <ProjectImage
                    id="project-image"
                    src={
                      project && project.avatar
                        ? project.avatar.src
                        : `https://via.placeholder.com/1050x450/${color.p1.replace(
                            '#',
                            '',
                          )}/${color.d1.replace(
                            '#',
                            '',
                          )}?text=${project.title.replace(' ', '+')}`
                    }
                  />
                  <span id="project-label">{project.description}</span>
                </ProjectCard>
              ))}
          </PortfolioContainer>
        </>
      )}
    </Container>
  );
};

FreelancerProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default FreelancerProfile;
