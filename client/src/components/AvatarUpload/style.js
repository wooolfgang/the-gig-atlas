import styled from 'styled-components';

/* eslint-disable operator-linebreak */
export const Avatar = styled.div`
  width: 125px;
  height: 125px;
  border-radius: 50%;
  border: 1px dashed ${props => props.theme.color.d3};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props =>
    props.src &&
    `
      border: 1px solid ${props.theme.color.d3};
      background: black url(${props.src}) center center no-repeat;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    `}

  :hover,
  :focus {
    border: 1px dashed ${props => props.theme.color.s2};
  }
`;

export const UploadImage = styled.div`
  font-size: 0.8rem;
  display: flex;
  width: 125px;
  justify-content: center;
  margin-top: 2px;
`;
