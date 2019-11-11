import React from 'react';

const Search = props => (
  <svg fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.19 14.607l1.23 1.226-.001.001a1 1 0 000 1.415l4.458 4.458a1 1 0 001.414 0l1.417-1.416a1 1 0 000-1.414l-4.458-4.459a1 1 0 00-1.415 0l-.004.004-1.229-1.224a7.043 7.043 0 01-1.411 1.41zm2.279 1.554a.5.5 0 00-.001.706l3.762 3.777a.5.5 0 00.708.001l.709-.708a.5.5 0 000-.707l-3.762-3.777a.5.5 0 00-.708 0l-.708.708z"
      fill={props.fill || '#333'}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 9A7 7 0 112 9a7 7 0 0114 0zm-1.2 0A5.8 5.8 0 113.2 9a5.8 5.8 0 0111.6 0z"
      fill={props.fill || '#333'}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.19 14.607l1.241 1.236 1.41-1.41-1.239-1.235a7.04 7.04 0 01-1.411 1.41z"
      fill={props.fill || '#4A4A4A'}
      fillOpacity={0.5}
    />
  </svg>
);

export default Search;
