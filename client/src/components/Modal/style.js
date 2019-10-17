import styled, { keyframes } from 'styled-components';

export const enterAnimation = keyframes`
  0% {
    transform: translateY(10px);
    opacity: 0;
  };

  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const enterAnimationOuter = keyframes`
  0% {
    opacity: 0;
  };

  100% {
    opacity: 1;
  }
`;

export const ModalOuter = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 9999999;
  align-items: center;
  justify-content: center;
  animation: ${enterAnimationOuter} 100ms cubic-bezier(0.39, 0.575, 0.565, 1)
    both;
`;

export const ModalInner = styled.div`
  margin: auto;
  padding: 1rem;
  box-sizing: border-box;
  background: white;
  border-radius: 2px;
  transition: all 100ms;
  z-index: 9999999;
  position: relative;
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  animation: ${enterAnimation} 100ms cubic-bezier(0.39, 0.575, 0.565, 1) both;
`;
