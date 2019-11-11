/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { color } from '../utils/theme';

const customStyles = {
  control: styles => ({
    ...styles,
    borderRadius: '0px',
    boxShadow: 'inset 0px 4px 20px rgba(0, 0, 0, 0.05)',
    background: color.d6,
    border: `1px solid ${color.d4}`,
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
  ...props
}) => (
  <ReactSelect
    value={_debugProp(options.filter(o => o.value === defaultValue)[0])}
    styles={customStyles}
    options={options}
    isClearable={isClearable}
    onChange={val => {
      onChange({
        target: {
          name,
          value: val.value,
        },
      });
    }}
    {...props}
  />
);

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  isClearable: PropTypes.bool,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
};

Select.defaultProps = {
  options: [],
  multiple: false,
  value: null,
  isClearable: true,
};

export default Select;

function _debugProp(prop) {
  console.log(prop);
  return prop;
}
