import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

const ErrorStyles = styled.div`
  padding: 1rem;
  border-radius: 3px;
  background-color: rgb(255, 241, 240);
  border: 1px solid rgb(255, 163, 158);
`;

const ErrorBanner = ({ error, style }) => {
  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((err, i) => (
      <ErrorStyles key={i}>
        <p data-test="graphql-error">
          <strong>Shoot!</strong>
          {err.message.replace('GraphQL error: ', '')}
        </p>
      </ErrorStyles>
    ));
  }
  return (
    <ErrorStyles style={style}>
      <span data-test="graphql-error">
        {error.message.replace('GraphQL error: ', '')}
      </span>
    </ErrorStyles>
  );
};

ErrorBanner.defaultProps = {
  error: {},
  style: {},
};

ErrorBanner.propTypes = {
  style: PropTypes.shape({}),
  error: PropTypes.shape({
    message: PropTypes.string,
    networkError: PropTypes.shape({
      result: PropTypes.shape({
        errors: PropTypes.arrayOf(PropTypes.shape),
      }),
    }),
  }),
};

export default ErrorBanner;
