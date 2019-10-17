import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import PropTypes from 'prop-types';
import { color } from '../../utils/theme';

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

const AsyncSelect = ({
  loadOptions,
  isMulti,
  isClearable,
  onChange,
  name,
  value,
  placeholder,
}) => (
  <AsyncCreatableSelect
    cacheOptions
    placeholder={placeholder}
    defaultOptions
    value={isMulti && value.map ? value.map(v => ({ label: v, value: v })) : {}}
    loadOptions={loadOptions}
    isMulti={isMulti}
    isClearable={isClearable}
    styles={customStyles}
    onChange={values => {
      const newValue = values ? values.map(v => v.value) : [];
      onChange({ target: { name, value: newValue } });
    }}
  />
);

AsyncSelect.propTypes = {
  loadOptions: PropTypes.func,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  placeholder: PropTypes.string,
};

AsyncSelect.defaultProps = {
  loadOptions: (inputValue, callback) => {
    callback();
  },
  isMulti: true,
  isClearable: true,
  value: [],
  placeholder: 'Select...',
};

export default AsyncSelect;
