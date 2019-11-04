import React from 'react';

const Error = ({ message }) => (
  <div>
    <h1>Something went wrong!</h1>
    <h2>{message}</h2>
  </div>
);

Error.getInitialProps = ctx => {
  // eslint-disable-next-line prefer-destructuring
  const message = ctx.query.message;

  return { message };
};

export default Error;
