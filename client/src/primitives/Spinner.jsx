import React from 'react';
import styled from 'styled-components';

const Spinner = props => (
  <StyledSpinner>
    <svg viewBox="0 0 50 50" width="18" height="18" {...props}>
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
      />
    </svg>
  </StyledSpinner>
);

const StyledSpinner = styled.div`
  svg {
    animation: rotate 2s ease-out infinite;

    & .path {
      stroke: ${props => props.theme.color.d2};
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }
  }
`;

export default Spinner;
