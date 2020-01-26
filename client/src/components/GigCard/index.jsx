import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Card,
  Flex,
  Avatar,
  Title,
  Tech,
  FirstRow,
  SecondRow,
  ThirdRow,
  GigExtension,
  GigSkeletonContainer,
  A,
} from './style';
import { color } from '../../utils/theme';
import {
  JOB_TYPE,
  PROJECT_TYPE,
  PAYMENT_TYPE,
  GIG_SOURCE,
} from '../../utils/constants';

const GigCard = ({
  margin,
  isMobile,
  gig: {
    id,
    title,
    tags,
    createdAt,
    projectType,
    locationRestriction,
    communicationWebsite,
    jobType,
    minFee,
    maxFee,
    media,
    from,
  },
}) => {
  const ExternalLink = () => {
    if (from === 'INTERNAL') {
      return (
        <Link href={`/gig/${id}`}>
          <A href={`/gig/${id}`}>View Job Posting -></A>
        </Link>
      );
    }
    return (
      <A href={communicationWebsite} target="_blank" rel="noopener noreferrer">
        View Job Posting ->
      </A>
    );
  };

  return (
    <Card style={{ margin }} tabIndex="0">
      <Flex>
        <FirstRow width={isMobile ? '20%' : '12%'}>
          <Avatar src={media && media.url} />
        </FirstRow>
        <SecondRow width={isMobile ? '80%' : '68%'}>
          <Title>{title}</Title>
          <span style={{ fontSize: '.95rem', color: color.d2 }}>
            {JOB_TYPE[jobType]} ‧ ${minFee}-${maxFee}{' '}
            {locationRestriction ? `‧ ${locationRestriction}` : '‧ Remote'}
          </span>
        </SecondRow>
        {!isMobile && (
          <ThirdRow width="20%">
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
                  fontSize: '0.8rem',
                }}
              >
                {projectType && projectType.toLowerCase()}
              </span>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {tags && tags.map(t => <Tech key={t.id}>{t.name}</Tech>)}
              </div>
            </>
          </ThirdRow>
        )}
      </Flex>
      <GigExtension>
        <span id="gig-from">
          From: {from === 'INTERNAL' ? 'GIG ATLAS' : from}
        </span>
        <ExternalLink />
      </GigExtension>
    </Card>
  );
};

GigCard.propTypes = {
  margin: PropTypes.string,
  isMobile: PropTypes.bool,
  gig: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ).isRequired,
    createdAt: PropTypes.string.isRequired,
    projectType: PropTypes.oneOf(Object.keys(PROJECT_TYPE)),
    paymentType: PropTypes.oneOf(Object.keys(PAYMENT_TYPE)),
    jobType: PropTypes.oneOf(Object.keys(JOB_TYPE)),
    locationRestriction: PropTypes.string,
    minFee: PropTypes.number.isRequired,
    maxFee: PropTypes.number.isRequired,
    employer: PropTypes.shape({
      id: PropTypes.string,
    }),
    media: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
    }),
    from: PropTypes.oneOf(Object.keys(GIG_SOURCE)),
    communicationWebsite: PropTypes.string,
  }),
};

GigCard.defaultProps = {
  margin: '0px',
  isMobile: false,
  gig: {
    tags: [],
  },
};

export const GigCardSkeleton = () => (
  <GigSkeletonContainer>
    <Flex>
      <FirstRow>
        <div id="gig-avatar" />
      </FirstRow>
      <SecondRow style={{ padding: '0 1rem' }}>
        <div id="gig-title" />
        <div id="gig-description" />
      </SecondRow>
    </Flex>
  </GigSkeletonContainer>
);

export default GigCard;
