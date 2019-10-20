import styled from 'styled-components';
import { InputStyles } from '../utils/theme';

const TextArea = styled.textarea`
  height: 8rem;
  padding: 0.2rem 0.4rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
    Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  ${InputStyles};
`;

export default TextArea;
