import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { color } from '../utils/theme';

const customStyles = {
  control: (styles, state) => ({
    ...styles,
    borderRadius: '0px',
    boxShadow: 'inset 0px 4px 20px rgba(0, 0, 0, 0.05)',
    background: color.d6,
    border: `1px solid ${
      // eslint-disable-next-line no-nested-ternary
      state.isFocused
        ? color.s3
        : state.selectProps.hasError
        ? color.e1
        : color.d4
    }`,
    '&:hover': {
      border: '1px solid none',
    },
  }),
  placeholder: defaultStyles => ({
    ...defaultStyles,
    color: 'rgba(0, 0, 0, 0.247)',
  }),
};

const Select = ({
  value: defaultValue,
  options,
  name,
  onChange,
  isClearable,
  hasError,
  ...props
}) => (
  <ReactSelect
    value={options.filter(o => o.value === defaultValue)[0]}
    styles={customStyles}
    options={options}
    isClearable={isClearable}
    hasError={hasError}
    onChange={val => {
      const newValue = val ? val.map(v => v.value) : [];
      onChange({ target: { name, value: newValue } });
    }}
    {...props}
  />
);

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  isClearable: PropTypes.bool,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
  hasError: PropTypes.bool,
};

Select.defaultProps = {
  options: [],
  multiple: false,
  value: null,
  isClearable: true,
  hasError: false,
};

export default Select;
