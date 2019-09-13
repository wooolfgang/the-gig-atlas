import React from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar, Title, Row, Tech } from './style';

/* 
  This is temporary hardcode-values until we have the final 
  schema from the backend 
*/

const GigCard = ({
  margin,
  avatarSrc,
  title,
  technologies,
  postedAt,
  projectType,
  location,
  jobType,
}) => {
  return (
    <Card style={{ margin }} tabIndex="0">
      <Row width="12%" style={{ padding: '8px' }}>
        <Avatar src={avatarSrc} />
      </Row>
      <Row width="60%">
        <Title>{title}</Title>
        <span>
          {jobType} | {location}
        </span>
      </Row>
      <Row width="28%" style={{ direction: 'rtl', zIndex: '3' }}>
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
      </Row>
    </Card>
  );
};

GigCard.propTypes = {
  margin: PropTypes.string,
  avatarSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
  postedAt: PropTypes.string.isRequired,
  projectType: PropTypes.string.isRequired,
  jobType: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

GigCard.defaultProps = {
  margin: '0px',
};

export default GigCard;
