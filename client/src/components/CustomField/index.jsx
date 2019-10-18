import React from 'react';
import PropTypes from 'prop-types';
import AsyncCreatableSelect from '../AsyncCreatableSelect';
import AvatarUpload from '../AvatarUpload';
import {
  TextArea,
  TextEditor,
  Input,
  Label,
  FieldHelp,
  FieldError,
  RadioCards,
  RadioButtons,
  Select,
} from '../../primitives';

const CustomField = ({
  field,
  form: { touched, errors },
  label,
  help,
  required,
  type,
  inputStyle,
  labelStyle,
  ...props
}) => {
  let InputComponent;
  if (type === 'textarea') {
    InputComponent = TextArea;
  } else if (type === 'radiocards') {
    InputComponent = RadioCards;
  } else if (type === 'radiobuttons') {
    InputComponent = RadioButtons;
  } else if (type === 'select') {
    InputComponent = Select;
  } else if (type === 'asyncselect') {
    InputComponent = AsyncCreatableSelect;
  } else if (type === 'avatarupload') {
    InputComponent = AvatarUpload;
  } else if (type === 'texteditor') {
    InputComponent = TextEditor;
  } else {
    InputComponent = Input;
  }

  const error = touched[field.name] && errors[field.name];

  return (
    <>
      <Label htmlFor={field.name} style={labelStyle}>
        <span id="label">
          {label} {!required && <small>(optional)</small>}
        </span>
        <InputComponent
          {...field}
          type={type}
          {...props}
          style={inputStyle}
          hasError={!!error}
        />
        {!error && <FieldHelp visible={!!help} value={help} />}
        <FieldError visible={!!error} value={error} />
      </Label>
    </>
  );
};

CustomField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    touched: PropTypes.object,
    errors: PropTypes.object,
  }).isRequired,
  label: PropTypes.string.isRequired,
  help: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  labelStyle: PropTypes.shape({}),
  inputStyle: PropTypes.shape({}),
};

CustomField.defaultProps = {
  required: true,
  type: 'input',
  help: null,
  labelStyle: {},
  inputStyle: {},
};

export default CustomField;
