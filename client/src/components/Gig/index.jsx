import React from 'react';
import PropTypes from 'prop-types';
import { Container, ClientContainer, GigContainer, Tech } from './style';
import { color } from '../../utils/theme';
import { JOB_TYPE } from '../../utils/constants';
import { Avatar, Button } from '../../primitives';

const Gig = ({ employer: _employer, gig: _gig, preview }) => {
  const employer = _employer || {};
  const gig = _gig || {};
  return (
    <Container>
      <ClientContainer>
        <div>
          <Avatar src={employer.avatar && employer.avatar.url} />
        </div>
        <div style={{ padding: '0 1.5rem' }}>
          <h2 style={{ margin: '0', marginBottom: '0.4rem' }}>
            {employer.displayName}
          </h2>
          <a
            href={employer.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              marginBottom: '0.3em',
              color: color.s2,
              textDecoration: 'none',
            }}
          >
            {employer.website}
          </a>
          <div dangerouslySetInnerHTML={{ __html: employer.introduction }} />
        </div>
      </ClientContainer>
      <GigContainer>
        <h2 style={{ margin: '0', marginBottom: '0.8rem' }}>{gig.title}</h2>
        <div style={{ marginBottom: '0.8em' }}>
          <span style={{ fontSize: '.95rem', color: color.d2 }}>
            {JOB_TYPE[gig.jobType]} ‧ ${gig.minFee}-${gig.maxFee}{' '}
            {gig.locationRestriction
              ? `‧ ${gig.locationRestriction}`
              : '‧ Remote'}
          </span>
        </div>
        <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
          {gig.tags &&
            gig.tags.map &&
            gig.tags.map(tech => <Tech key={tech.id}>{tech.name}</Tech>)}
        </div>
        <div
          style={{ marginBottom: '2rem' }}
          dangerouslySetInnerHTML={{ __html: gig.description }}
        />
        <Button styleType="submit">Apply Now</Button>
      </GigContainer>
    </Container>
  );
};

Gig.propTypes = {
  preview: PropTypes.bool,
  employer: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    introduction: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    employerType: PropTypes.string.isRequired,
    avatar: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
  gig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ).isRequired,
    projectType: PropTypes.string.isRequired,
    minFee: PropTypes.number,
    maxFee: PropTypes.number,
    jobType: PropTypes.string.isRequired,
    paymentType: PropTypes.string.isRequired,
    locationRestriction: PropTypes.string,
    communicationType: PropTypes.string.isRequired,
    communicationEmail: PropTypes.string,
    communicationWebsite: PropTypes.string,
  }),
};

Gig.defaultProps = {
  preview: false,
  employer: {},
  gig: {},
};

export default Gig;
