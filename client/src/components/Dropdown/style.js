import styled from 'styled-components';
import { zIndex } from '../../utils/globals';

export const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0px;
  transform: scale(0);
  z-index: ${zIndex.dropdown};

  ${props =>
    props.visible &&
    `
    transform: scale(1);
    `};
`;

export const DropdownCard = styled.div`
  background: #fff;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 2px;
  transition: all 250ms ease-out;
  transform: translateY(2px);
  border: 1px solid ${props => props.theme.color.neutral5};

  ${props =>
    props.visible &&
    `
      transform: translateY(0px);
      box-shadow: 0px 8px 6px -6px ${props.theme.color.d4};
    `};
`;
