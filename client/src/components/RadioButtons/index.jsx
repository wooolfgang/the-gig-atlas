import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup } from './style';

const RadioButtons = ({
  options,
  name,
  value: defaultValue,
  onChange,
  onBlur,
}) => (
  <RadioGroup>
    {options.map(({ id, label, value }) => (
      <label htmlFor={id} style={{ marginRight: '.6rem' }} key={id}>
        <input
          checked={defaultValue === value}
          value={value}
          type="radio"
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          id={id}
          style={{ marginRight: '.4rem' }}
        />
        {label}
      </label>
    ))}
  </RadioGroup>
);

RadioButtons.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
    }).isRequired
  ).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

RadioButtons.defaultProps = {
  value: null,
};

export default RadioButtons;
