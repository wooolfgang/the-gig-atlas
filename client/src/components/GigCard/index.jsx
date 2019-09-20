import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Flex,
  Avatar,
  Title,
  Tech,
  FirstRow,
  SecondRow,
  ThirdRow,
  Centered,
} from './style';

const GigCard = ({
  margin,
  isMobile,
  gig: {
    avatarSrc,
    title,
    technologies,
    postedAt,
    projectType,
    location,
    jobType,
  },
}) => {
  return (
    <Card style={{ margin }} tabIndex="0">
      <Flex>
        <FirstRow width={isMobile ? '20' : '12%'}>
          <Avatar src={avatarSrc} />
        </FirstRow>
        <SecondRow width={isMobile ? '80%' : '60%'}>
          <Title>{title}</Title>
          <span>
            {jobType} | {location}
          </span>
        </SecondRow>
        {!isMobile && (
          <ThirdRow width="28%">
            <>
              <small style={{ marginBottom: '4px' }}>
                {new Date(postedAt)
                  .toDateString()
                  .split(' ')
                  .slice(1)
                  .join(' ')}
              </small>
              <span style={{ marginBottom: '8px' }}>{projectType}</span>
              <div>
                {technologies.map((t, i) => (
                  <Tech key={i}>{t}</Tech>
                ))}
              </div>
            </>
          </ThirdRow>
        )}
      </Flex>
      {isMobile && (
        <Centered>
          <small>
            {new Date(postedAt)
              .toDateString()
              .split(' ')
              .slice(1)
              .join(' ')}
          </small>
          <span style={{ marginBottom: '4px' }}>{projectType}</span>
          <div style={{ overflow: 'hidden' }}>
            {technologies.map((t, i) => (
              <Tech key={i}>{t}</Tech>
            ))}
          </div>
        </Centered>
      )}
    </Card>
  );
};

GigCard.propTypes = {
  margin: PropTypes.string,
  isMobile: PropTypes.bool,
  gig: PropTypes.shape({
    avatarSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    technologies: PropTypes.array.isRequired,
    postedAt: PropTypes.string.isRequired,
    projectType: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};

GigCard.defaultProps = {
  margin: '0px',
  isMobile: false,
};

export default GigCard;
