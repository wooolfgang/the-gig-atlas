import styled from 'styled-components';
import media from '../../utils/media';

export const Price = styled.span`
  color: ${props => props.theme.color.s1};
  font-size: 1.4rem;
`;

export const Back = styled.button`
  background: none;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Next = styled.button`
  border: none;
  background: #ffe000;
  border-radius: 2px;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const RateContainer = styled.div`
  display: flex;

  ${media.phone`
  flex-direction: column;
`};
`;
