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

const Gig = ({ client, gig, preview }) => (
  <Container>
    <ClientContainer>
      <div>
        <Avatar src={client.avatarSrc} />
      </div>
      <div style={{ padding: '0 1rem' }}>
        <h2 style={{ margin: '0', marginBottom: '0.4rem' }}>
          {client.companyName}
        </h2>
        <a
          href={client.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', marginBottom: '0.3em' }}
        >
          {client.website}
        </a>
        <span>{client.companyDescription}</span>
        <span>{client.communicationEmail}</span>
      </div>
    </ClientContainer>
    <GigContainer>
      <h2 style={{ margin: '0', marginBottom: '0.8rem' }}>{gig.title}</h2>
      <div style={{ marginBottom: '0.8em' }}>
        {gig.jobType} | {gig.paymentType} ({gig.minRate}-{gig.maxRate}) |{' '}
        {gig.projectType} | {gig.locationAndTimezone}
      </div>
      <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
        {gig.technologies &&
          gig.technologies.map &&
          gig.technologies.map(tech => <Tech>{tech}</Tech>)}
      </div>
      <div style={{ marginBottom: '2rem' }}>{gig.description}</div>
      <ApplyButton>Apply For Gig</ApplyButton>
    </GigContainer>
  </Container>
);

Gig.propTypes = {
  preview: PropTypes.bool,
  client: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    companyWebsite: PropTypes.string.isRequired,
    companyDescription: PropTypes.string.isRequired,
    communicationType: PropTypes.string.isRequired,
    communicationEmail: PropTypes.string,
    communicationWebsite: PropTypes.string,
    avatarSrc: PropTypes.string,
  }),
  gig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    locationAndTimezone: PropTypes.string,
    maxRate: PropTypes.number,
    minRate: PropTypes.number,
    paymentType: PropTypes.string.isRequired,
    projectType: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};

Gig.defaultProps = {
  preview: false,
  client: {},
  gig: {},
};

export default Gig;
