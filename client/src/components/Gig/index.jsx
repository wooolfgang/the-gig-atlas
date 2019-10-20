import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  ClientContainer,
  Avatar,
  GigContainer,
  Tech,
  ApplyButton,
} from './style';

const Gig = ({ employer: _employer, gig: _gig, preview }) => {
  const employer = _employer || {};
  const gig = _gig || {};
  return (
    <Container>
      <ClientContainer>
        <div>
          <Avatar src={employer.avatarSrc} />
        </div>
        <div style={{ padding: '0 1rem' }}>
          <h2 style={{ margin: '0', marginBottom: '0.4rem' }}>
            {employer.displayName}
          </h2>
          <a
            href={employer.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', marginBottom: '0.3em' }}
          >
            {employer.website}
          </a>
          <div
            contentEditable="true"
            dangerouslySetInnerHTML={{ __html: employer.introduction }}
          />
        </div>
      </ClientContainer>
      <GigContainer>
        <h2 style={{ margin: '0', marginBottom: '0.8rem' }}>{gig.title}</h2>
        <div style={{ marginBottom: '0.8em' }}>
          {gig.jobType} | {gig.paymentType} ({gig.minFee}-{gig.maxFee}) |{' '}
          {gig.projectType} | {gig.locationRestriction}
        </div>
        <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
          {gig.technologies &&
            gig.technologies.map &&
            gig.technologies.map(tech => <Tech key={tech}>{tech}</Tech>)}
        </div>
        <div
          style={{ marginBottom: '2rem' }}
          contentEditable="true"
          dangerouslySetInnerHTML={{ __html: gig.description }}
        />
        <ApplyButton>Apply For Gig</ApplyButton>
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
    avatarSrc: PropTypes.string,
  }),
  gig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
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
