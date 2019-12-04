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
import { color } from '../../utils/theme';

const JOB_TYPE = {
  PART_TIME: 'Part-time',
  FULL_TIME: 'Full-time',
  CONTRACT: 'Contract',
};

const GigCard = ({
  margin,
  isMobile,
  gig: {
    title,
    tags,
    createdAt,
    projectType,
    locationRestriction,
    jobType,
    minFee,
    maxFee,
    employer: {
      avatar: { url },
    },
  },
}) => (
  <Card style={{ margin }} tabIndex="0">
    <Flex>
      <FirstRow width={isMobile ? '20' : '12%'}>
        <Avatar src={url} />
      </FirstRow>
      <SecondRow width={isMobile ? '80%' : '60%'}>
        <Title>{title}</Title>
        <span style={{ fontSize: '1rem', color: color.d2 }}>
          {JOB_TYPE[jobType]} ‧ ${minFee}-${maxFee}{' '}
          {locationRestriction ? `‧ ${locationRestriction}` : '‧ Remote'}
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
            <span
              style={{
                marginBottom: '8px',
                fontSize: '0.9rem',
              }}
            >
              {projectType && projectType.toLowerCase()}
            </span>
            <div>{tags && tags.map(t => <Tech key={t.id}>{t.name}</Tech>)}</div>
          </>
        </ThirdRow>
      )}
    </Flex>
    {isMobile && (
      <Centered>
        <small>
          {new Date(createdAt)
            .toDateString()
            .split(' ')
            .slice(1)
            .join(' ')}
        </small>
        <span style={{ marginBottom: '4px' }}>{projectType}</span>
        <div style={{ overflow: 'hidden' }}>
          {tags.map(t => (
            <Tech key={t.id}>{t.name}</Tech>
          ))}
        </div>
      </Centered>
    )}
  </Card>
);

GigCard.propTypes = {
  margin: PropTypes.string,
  isMobile: PropTypes.bool,
  gig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ).isRequired,
    createdAt: PropTypes.string.isRequired,
    projectType: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    locationRestriction: PropTypes.string,
    minFee: PropTypes.number.isRequired,
    maxFee: PropTypes.number.isRequired,
    employer: PropTypes.shape({
      avatar: PropTypes.shape({
        id: PropTypes.string,
        url: PropTypes.string,
      }),
    }),
  }),
};

GigCard.defaultProps = {
  margin: '0px',
  isMobile: false,
  gig: {
    tags: [],
  },
};

export default GigCard;
