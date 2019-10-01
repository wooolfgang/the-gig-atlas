import React from 'react';
import PropTypes from 'prop-types';
import GigCard from '../GigCard';
import { MediaConsumer } from '../MediaProvider';

const GigsList = ({ gigs }) =>
  gigs.map(gig => (
    <MediaConsumer key={gig.id}>
      {({ size }) => {
        const isMobile =
          size === 'xsPhone' || size === 'phone' || size === 'tablet';
        return (
          <GigCard
            key={gig.id}
            gig={gig}
            margin="0 0 12px 0"
            isMobile={isMobile}
          />
        );
      }}
    </MediaConsumer>
  ));

GigsList.propTypes = {
  gigs: PropTypes.arrayOf(PropTypes.object),
};

GigsList.defaultProps = {
  gigs: [],
};

export default GigsList;
