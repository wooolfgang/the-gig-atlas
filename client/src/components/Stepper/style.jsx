import styled from 'styled-components';
import { animated } from 'react-spring';
import media from '../../utils/media';

export const StepperContainer = styled.div`
  display: flex;
`;

export const StepContainer = styled.div`
  ${props => !props.active && 'opacity: 0.5;'};
  padding: 0.25em;
  box-sizing: border-box;

  ${media.phone`
    font-size: 12px;
  `};

  ${media.xsPhone`
    font-size: 14px;
  `};

  #step {
    font-size: 0.925em;
  }

  #title {
    margin: 0;
    margin: 0.35em 0;
    font-size: 1.2em;
  }

  #description {
    font-size: 0.875em;
  }
`;

export const StepBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

export const AnimatedBar = styled(animated.div)`
  background-color: ${props => props.theme.color.s1};
  height: 0.2em;
  margin-left: 0.2em;
`;
