import React from 'react';

const Cancel = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
    fill={props.background || 'none'}
  >
    <rect width="24" height="24" rx="0" ry="0" />
    <path
      fill={props.fill || '#fff'}
      fillRule="evenodd"
      d="M19.774 4.218a1 1 0 00-1.414 0l-6.364 6.364-6.364-6.364a1 1 0 10-1.414 1.414l6.364 6.364-6.364 6.364a1 1 0 101.414 1.415l6.364-6.364 6.364 6.364a1 1 0 101.415-1.415l-6.364-6.364 6.364-6.364a1 1 0 000-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Cancel;
