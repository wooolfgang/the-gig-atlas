import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import PropTypes from 'prop-types';
import { color } from '../../utils/theme';

const customStyles = {
  control: (styles, state) => ({
    ...styles,
    borderRadius: '2px',
    boxShadow: 'inset 0px 4px 20px rgba(0, 0, 0, 0.05)',
    background: color.d6,
    border: `2px solid ${
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

const AsyncSelect = ({
  loadOptions,
  isMulti,
  isClearable,
  onChange,
  name,
  value,
  placeholder,
  hasError,
}) => (
  <AsyncCreatableSelect
    cacheOptions
    placeholder={placeholder}
    defaultOptions
    value={isMulti && value.map ? value.map(v => ({ label: v, value: v })) : {}}
    loadOptions={loadOptions}
    isMulti={isMulti}
    isClearable={isClearable}
    hasError={hasError}
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
  hasError: PropTypes.bool,
};

AsyncSelect.defaultProps = {
  loadOptions: (inputValue, callback) => {
    callback();
  },
  isMulti: true,
  isClearable: true,
  value: [],
  placeholder: 'Select...',
  hasError: false,
};

export default AsyncSelect;
