import styled from 'styled-components';
import { InputStyles } from '../../utils/theme';

export const CardOptionsContainer = styled.div`
  display: flex;
`;

export const Card = styled.div`
  width: 200px;
  max-width: 30%;
  min-height: 100px;
  padding: 0.75rem 0.75rem;
  margin-right: 1rem;
  cursor: pointer;
  ${InputStyles};
`;

export const Description = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  margin: 0;
  word-wrap: break-word;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
`;
