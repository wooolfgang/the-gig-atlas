import React from 'react';
import { useSpring } from 'react-spring';
import PropTypes from 'prop-types';
import {
  StepperContainer,
  StepContainer,
  StepBarContainer,
  AnimatedBar,
} from './style';

const Bar = ({ visible }) => {
  const props = useSpring({
    opacity: visible ? 1 : 0,
    flex: visible ? 1 : 0,
  });
  return <AnimatedBar style={props} />;
};

Bar.propTypes = {
  visible: PropTypes.bool,
};

Bar.defaultProps = {
  visible: false,
};

const Step = ({ activeIndex, title, description, index }) => {
  const active = index <= activeIndex;
  return (
    <StepContainer active={active}>
      <StepBarContainer>
        <span id="step">Step {index + 1}</span>
        <Bar visible={active} />
      </StepBarContainer>
      <h3 id="title">{title}</h3>
      <span id="description">{description}</span>
    </StepContainer>
  );
};

Step.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
};

const Stepper = ({ steps, activeIndex }) => {
  return (
    <StepperContainer>
      {steps.map((step, index) => (
        <Step
          {...step}
          activeIndex={activeIndex}
          index={index}
          key={step.title}
        />
      ))}
    </StepperContainer>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  activeIndex: PropTypes.number,
};

Stepper.defaultProps = {
  activeIndex: 0,
};

export default Stepper;
