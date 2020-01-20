import React from 'react';

const Menu = props => (
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
      d="M4 7a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H4.75A.75.75 0 014 7zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H4.75A.75.75 0 014 12zm.75 4.25a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"
      clipRule="evenodd"
    />
  </svg>
);

export default Menu;
