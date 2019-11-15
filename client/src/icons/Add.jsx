import React from 'react';

const Add = props => (
  <svg {...props}>
    <rect {...props} fill="none" rx="0" ry="0" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 21C11 21.55 11.45 22 12 22C12.55 22 13 21.55 13 21V13H21C21.55 13 22 12.55 22 12C22 11.45 21.55 11 21 11H13V3C13 2.45 12.55 2 12 2C11.45 2 11 2.45 11 3V11H3C2.45 11 2 11.45 2 12C2 12.55 2.45 13 3 13H11V21Z"
      fill={props.fill}
    />
  </svg>
);

export default Add;
