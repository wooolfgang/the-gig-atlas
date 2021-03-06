import React from 'react';

const Twitter = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
    fill="none"
  >
    <rect width="24" height="24" rx="0" ry="0" />
    <path
      fill={props.fill || '#fff'}
      fillRule="evenodd"
      d="M6.53 20.932H18.6c1.54 0 2.79-1.26 2.79-2.79V6.072c0-1.54-1.25-2.79-2.79-2.79H6.53c-1.54 0-2.79 1.25-2.79 2.79v12.07c0 1.54 1.25 2.79 2.79 2.79zM4.94 6.072c0-.88.71-1.59 1.59-1.59H18.6c.88 0 1.59.71 1.59 1.59v12.07c0 .88-.71 1.59-1.59 1.59H6.53c-.88 0-1.59-.71-1.59-1.59V6.072zm11.68 3.08c.43-.05.86-.17 1.25-.34-.29.44-.66.82-1.1 1.14.01.09.01.18.01.28 0 2.87-2.18 6.19-6.19 6.19-1.23 0-2.38-.36-3.34-.98a4.405 4.405 0 003.22-.9c-.95-.02-1.75-.66-2.03-1.52.13.03.27.04.41.04.2 0 .39-.02.57-.07a2.18 2.18 0 01-1.74-2.14v-.02c.29.16.63.26.98.27a2.19 2.19 0 01-.97-1.81c0-.4.11-.77.3-1.1a6.19 6.19 0 004.49 2.28 2.07 2.07 0 01-.05-.5c0-1.2.98-2.18 2.18-2.18.62 0 1.19.26 1.59.69.49-.1.96-.28 1.38-.53-.16.51-.51.93-.96 1.2z"
      clipRule="evenodd"
    />
  </svg>
);

export default Twitter;
