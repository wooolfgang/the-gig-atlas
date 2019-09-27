import styled from 'styled-components';
import media from '../../utils/media';

export const Container = styled.div`
  width: 100%;
  padding-bottom: 4rem;
`;

export const Avatar = styled.div`
  width: 125px;
  height: 125px;
  border-radius: 50%;
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
`;

export const ClientContainer = styled.div`
  width: 90%;
  margin: auto;
  box-sizing: border-box;
  padding: 2rem 2rem 0 2rem;
  display: flex;

  ${media.phone`
    flex-direction: column;
  `}
`;

export const GigContainer = styled.div`
  width: 90%;
  padding: 2rem 2rem 0 2rem;
  margin: auto;
  box-sizing: border-box;
`;

export const Tech = styled.div`
  background-color: ${props => props.theme.color.p2};
  padding: 0.2rem 0.4rem;
  font-size: 0.825em;
  box-sizing: border-box;
  margin-right: 0.4rem;
`;

export const ApplyButton = styled.button`
  border: none;
  background: #ffe000;
  border-radius: 2px;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: auto;
`;
