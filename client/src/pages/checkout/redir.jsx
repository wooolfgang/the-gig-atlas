import React from 'react';

const Redir = () => <div>{'sucessful transaction'}</div>;

Redir.getInitialProps = ({ query }) => {
  console.log('query result: ', query);

  return {};
};

export default Redir;
