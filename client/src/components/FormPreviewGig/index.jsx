import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { GET_CLIENT_INFO } from '../FormClientInfo';
import { GET_GIG_DETAILS } from '../FormGigDetails';
import Spinner from '../../primitives/Spinner';
import { Back, Next, Price } from '../FormGigDetails/style';
import Gig from '../Gig';

const GigContainer = styled.div`
  background: ${props => props.theme.color.d6};
  box-sizing: border-box;
  margin: auto;
`;

const FormPreviewGig = ({ back, next }) => {
  const { data: client, loading: loading1 } = useQuery(GET_CLIENT_INFO);
  const { data: gig, loading: loading2 } = useQuery(GET_GIG_DETAILS);
  if (loading1 || loading2) {
    return (
      <>
        Loading cache... <Spinner />
      </>
    );
  }

  return (
    <div>
      <h2> See how people will see your post</h2>
      <GigContainer>
        <Gig
          client={client && client.clientInfo}
          gig={gig && gig.gigDetails}
          preview
        />
      </GigContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '2.5rem',
        }}
      >
        <span>
          Total:<Price> $89.99 </Price>
        </span>
        <div style={{ display: 'flex' }}>
          <Back type="button" onClick={back}>
            <span style={{ marginRight: '5px' }}>Back </span>
            <img
              src="/static/corner-down-left.svg"
              alt="back-icon"
              style={{ width: '1rem' }}
            />
          </Back>
          <Next type="button" onClick={next}>
            <span style={{ marginRight: '5px' }}>Finish Purchase </span>
            <img
              src="/static/arrow-right.svg"
              alt="arrow-right-icon"
              style={{ width: '1rem' }}
            />
          </Next>
        </div>
      </div>
    </div>
  );
};

FormPreviewGig.propTypes = {
  back: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
};

export default FormPreviewGig;
