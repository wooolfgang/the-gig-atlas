import styled, { css } from 'styled-components';

export const UpvoteCount = styled.div`
  transition: all 200ms ease-in-out;
  fill: ${props => props.theme.color.d3};
`;

const focused = css`
  ${UpvoteCount} {
    transform: scale(1.2);
    color: ${props => props.theme.color.s2};
  }
  svg {
    fill: ${props => props.theme.color.s2};
    transform: translateY(-1px);
  }
`;

export const UpvoteContainer = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2px;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;

  svg {
    transition: all 200ms ease-in-out;
    fill: ${props => props.theme.color.d3};
  }

  :hover,
  :focus {
    ${focused}
  }

  ${props => props.hasUserUpvoted && focused}
`;
