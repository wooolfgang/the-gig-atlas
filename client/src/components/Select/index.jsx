import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputStyles } from '../../utils/theme';

const StyledSelect = styled.select`
  ${InputStyles};
`;

const Select = ({ value: defaultValue, options, onChange, ...props }) => (
  <StyledSelect
    value={defaultValue}
    onChange={e => {
      if (props.multiple) {
        const selectedOptions = [].slice.call(e.target.selectedOptions);
        const values = selectedOptions.map(o => o.value);
        onChange({ target: { name: props.name, value: values } });
      } else {
        onChange(e);
      }
    }}
    {...props}
    multiple
  >
    {options.map(({ value, title }) => (
      <option key={value} value={value}>
        {title}
      </option>
    ))}
  </StyledSelect>
);

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
};

Select.defaultProps = {
  options: [],
  multiple: false,
  value: null,
};

export default Select;
