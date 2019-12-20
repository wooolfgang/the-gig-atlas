import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSwitch = styled.button`
  box-sizing: border-box;
  font-size: 1rem;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.05);
  background: ${props => props.theme.color.d6};
  border: 2px solid ${props => props.theme.color.d4};
  border-radius: 2px;
  min-height: 2em;
  padding: 0;
  display: flex;

  ${props =>
    props.hasError &&
    `
    border: 2px solid ${props.theme.color.e1} !important;

    * {
      color: ${props.theme.color.e1};
    }
  `}
`;

const SwitchValue = styled.button`
  flex: 1;
  margin: auto;
  border: none;
  background: none;
  border-radius: 2px;
  padding: 6px 4px;
  box-sizing: border-box;
  font-size: 0.95rem;
  height: 100%;
  outline: none;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  ${props =>
    props.active &&
    `
    background: ${props.theme.color.d1};
    color: white;
  `}
`;

const FormSwitch = ({ value, options, name, onChange, hasError }) => {
  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      const currentIndex = options.findIndex(option => option.value === value);
      let nextIndex = currentIndex + 1;
      if (nextIndex >= options.length) {
        nextIndex = 0;
      }
      onChange({
        target: {
          name,
          value: options[nextIndex] && options[nextIndex].value,
        },
      });
    }
  };

  return (
    <StyledSwitch hasError={hasError} onKeyDown={handleKeyDown} type="button">
      {options.map(option => (
        <SwitchValue
          type="button"
          active={option.value === value}
          onClick={() => {
            onChange({
              target: {
                name,
                value: option.value,
              },
            });
          }}
        >
          {option.label}
        </SwitchValue>
      ))}
    </StyledSwitch>
  );
};

FormSwitch.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
  hasError: PropTypes.bool,
};

FormSwitch.defaultProps = {
  options: [],
  value: null,
  hasError: false,
};

export default FormSwitch;
