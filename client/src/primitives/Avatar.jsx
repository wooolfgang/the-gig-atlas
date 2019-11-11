import styled from 'styled-components';

/* eslint-disable operator-linebreak */
const Avatar = styled.div`
  width: 125px;
  height: 125px;
  border-radius: 50%;
  border: 1px dashed ${props => props.theme.color.neutral5};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  transition: all 100ms ease-in-out;

  ${props =>
    props.src &&
    `
      border: 1px solid ${props.theme.color.neutral5};
      background: #fff url(${props.src}) center center no-repeat;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    `}

  ${props =>
    props.hasError &&
    `
    border: 1px dashed ${props.theme.color.e1};
  `}

  :hover,
  :focus {
    border: 1px solid ${props => props.theme.color.p1};
    outline: none;
  }
`;

export default Avatar;
