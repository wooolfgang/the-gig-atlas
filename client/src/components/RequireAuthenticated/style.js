import styled from 'styled-components';

export const WrapperButton = styled.button`
  background: none;
  border: none;
  outline: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
    Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
`;

export const DisablePointerEvents = styled.div`
  pointer-events: none;
`;

export const ModalContainer = styled.div`
  padding: 0.5rem 0.65rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const SwitchButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.color.s2};
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;
