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
  avatarSrc,
  gig: {
    title,
    technologies,
    createdAt,
    projectType,
    locationRestriction,
    jobType,
    minFee,
    maxFee,
  },
}) => (
  <Card style={{ margin }} tabIndex="0">
    <Flex>
      <FirstRow width={isMobile ? '20' : '12%'}>
        <Avatar src={avatarSrc} />
      </FirstRow>
      <SecondRow width={isMobile ? '80%' : '60%'}>
        <Title>{title}</Title>
        <span>
          {jobType} | {locationRestriction} | ${minFee}-${maxFee}
        </span>
      </SecondRow>
      {!isMobile && (
        <ThirdRow width="28%">
          <>
            <small style={{ marginBottom: '4px' }}>
              {new Date(createdAt)
                .toDateString()
                .split(' ')
                .slice(1)
                .join(' ')}
            </small>
            <span style={{ marginBottom: '8px' }}>{projectType}</span>
            <div>
              {technologies &&
                technologies.map((t, i) => <Tech key={i}>{t}</Tech>)}
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

GigCard.propTypes = {
  margin: PropTypes.string,
  isMobile: PropTypes.bool,
  avatarSrc: PropTypes.string.isRequired,
  gig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    technologies: PropTypes.array.isRequired,
    createdAt: PropTypes.string.isRequired,
    projectType: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    locationRestriction: PropTypes.string.isRequired,
    minFee: PropTypes.number.isRequired,
    maxFee: PropTypes.number.isRequired,
  }),
};

GigCard.defaultProps = {
  margin: '0px',
  isMobile: false,
  gig: {
    technologies: [],
  },
};

export default GigCard;
