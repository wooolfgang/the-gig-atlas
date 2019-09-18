import React from 'react';
import PropTypes from 'prop-types';
import RadioCards from '../RadioCards';
import RadioGroups from '../RadioButtons';
import {
  Textarea,
  Input,
  Label,
  FieldHelp,
  FieldError,
} from '../../primitives';

const CustomField = ({
  field,
  form: { touched, errors },
  label,
  help,
  required,
  type,
  ...props
}) => {
  let InputComponent;

  if (type === 'textarea') {
    InputComponent = Textarea;
  } else if (type === 'radiocards') {
    InputComponent = RadioCards;
  } else if (type === 'radiogroups') {
    InputComponent = RadioGroups;
  } else {
    InputComponent = Input;
  }

  const error = touched[field.name] && errors[field.name];

  return (
    <>
      <Label htmlFor={field.name}>
        <span id="label">
          {label} {!required && <small>(optional)</small>}
        </span>
        <InputComponent {...field} type={type} {...props} />
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
};

CustomField.defaultProps = {
  required: true,
  type: 'input',
  help: null,
};

export default CustomField;
