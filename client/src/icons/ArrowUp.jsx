import React from 'react';

const ArrowUp = props => (
  <svg {...props}>
    <rect {...props} fill="none" rx="0" ry="0" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7088 8.29641L18.7088 14.2964C19.0988 14.6864 19.0988 15.3164 18.7088 15.7064C18.3188 16.0964 17.6888 16.0964 17.2988 15.7064L11.9988 10.4164L6.70878 15.7064C6.31878 16.0964 5.68878 16.0964 5.29878 15.7064C5.09878 15.5164 4.99878 15.2664 4.99878 15.0064C4.99878 14.7464 5.09878 14.4964 5.28878 14.2964L11.2888 8.29641C11.6788 7.90641 12.3188 7.90641 12.7088 8.29641Z"
      fill={props.fill}
    />
  </svg>
);

export default ArrowUp;
