import styled from 'styled-components';
import media from '../../utils/media';

export const Container = styled.div`
  width: 100%;
  padding-bottom: 4rem;
`;

export const ClientContainer = styled.div`
  width: 90%;
  margin: auto;
  box-sizing: border-box;
  padding: 2rem;
  display: flex;
  font-size: 0.925rem;

  ${media.phone`
    flex-direction: column;
  `}
`;

export const GigContainer = styled.div`
  width: 90%;
  padding: 2rem;
  margin: auto;
  box-sizing: border-box;
  border: 1px dashed lightgray;
`;

export const Tech = styled.div`
  background-color: ${props => props.theme.color.p2};
  padding: 0.2rem 0.4rem;
  font-size: 0.825em;
  box-sizing: border-box;
  margin-right: 0.4rem;
`;
