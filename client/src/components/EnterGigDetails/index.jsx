import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';

const InputStyles = css`
  box-sizing: border-box;
  font-size: 1rem;
  border: none;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.color.d4};
  border: 1px solid ${props => props.theme.color.d4};

  ${props =>
    props.selected &&
    `
    outline: 0;
    border: 1px solid ${props.theme.color.s1};
  `}

  :hover,
  :focus {
    outline: 0;
    border: 1px solid ${props => props.theme.color.s1};
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  #label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
`;

const Input = styled.input`
  padding: 0.4rem 0.4rem;
  ${InputStyles};
`;

const TextArea = styled.textarea`
  height: 8rem;
  padding: 0.2rem 0.4rem;
  ${InputStyles};
`;

const CardOptionsContainer = styled.div`
  display: flex;
`;

const Card = styled.div`
  width: 200px;
  max-width: 30%;
  height: 100px;
  padding: 1rem;
  margin-right: 1rem;
  cursor: pointer;
  ${InputStyles};
`;

const Description = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  margin: 0;
  word-wrap: break-word;
`;

const Title = styled.p`
  margin: 0;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
`;

const RadioGroup = styled.div``;

const Price = styled.span`
  color: ${props => props.theme.color.s1};
  font-size: 1.4rem;
`;

const Next = styled.button`
  border: none;
  background: #ffe000;
  border-radius: 2px;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ArrowNext = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" fill="none">
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M1.512 8h11.232M7.128 1l5.616 7-5.616 7"
    />
  </svg>
);

const CardOption = ({
  name,
  value,
  title,
  description,
  onChange,
  selected,
}) => (
  <Card
    selected={selected}
    tabIndex="0"
    role="button"
    aria-pressed="false"
    onClick={() => {
      onChange({ target: { name, value } });
    }}
  >
    <Title>{title}</Title>
    <Description>{description}</Description>
  </Card>
);

CardOption.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

CardOption.defaultProps = {
  selected: false,
};

const RadioCards = ({
  options,
  onBlur,
  onChange,
  name,
  value: defaultValue,
}) => (
  <CardOptionsContainer>
    {options.map(({ value, title, description }) => (
      <CardOption
        value={value}
        title={title}
        description={description}
        name={name}
        selected={defaultValue === value}
        key={value}
        onBlur={onBlur}
        onChange={onChange}
      />
    ))}
  </CardOptionsContainer>
);

RadioCards.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
      ]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

RadioCards.defaultProps = {
  options: [],
  value: null,
};

const RadioGroups = ({
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

RadioGroups.propTypes = {
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

RadioGroups.defaultProps = {
  value: null,
};

const FieldComponent = ({
  field,
  form: { touched, errors },
  label,
  required,
  type,
  ...props
}) => {
  let InputComponent;

  if (type === 'textarea') {
    InputComponent = TextArea;
  } else if (type === 'radiocards') {
    InputComponent = RadioCards;
  } else if (type === 'radiogroups') {
    InputComponent = RadioGroups;
  } else {
    InputComponent = Input;
  }

  return (
    <Label htmlFor={field.name}>
      <span id="label">
        {label} {!required && <small>(optional)</small>}
      </span>
      <InputComponent {...field} type={type} {...props} />
      {touched[field.name] && errors[field.name] && (
        <div className="error">{errors[field.name]}</div>
      )}
    </Label>
  );
};

FieldComponent.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number.isRequired,
    ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    touched: PropTypes.object,
    errors: PropTypes.object,
  }).isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
};

FieldComponent.defaultProps = {
  required: true,
  type: 'input',
};

const FieldInputComponent = ({ field, ...props }) => (
  <Input {...field} {...props} />
);

FieldInputComponent.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number.isRequired,
    ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }).isRequired,
};

const EnterGigDetails = ({ next }) => {
  return (
    <Formik
      render={() => (
        <Form onSubmit={next}>
          <Field
            name="title"
            type="text"
            label="Title"
            component={FieldComponent}
          />
          <Field
            name="description"
            type="textarea"
            label="Description"
            component={FieldComponent}
          />
          <Field
            name="projectType"
            component={FieldComponent}
            type="radiocards"
            label="Project Type"
            options={[
              {
                value: 'greenfield',
                title: 'Greenfield',
                description: 'A project that starts from scratch',
              },
              {
                value: 'maintenance/features',
                title: 'Maintenance/Features',
                description: 'A project that starts from scratch',
              },
              {
                value: 'consulting',
                title: 'Consulting',
                description: 'A project that starts from scratch',
              },
            ]}
          />
          <Field
            label="Technologies"
            name="technologies"
            component={FieldComponent}
          />
          <Field
            name="paymentType"
            label="Payment Type"
            type="radiogroups"
            component={FieldComponent}
            options={[
              {
                id: 'radio1',
                label: 'Fixed',
                value: 'fixed',
              },
              {
                id: 'radio2',
                label: 'Hourly',
                value: 'hourly',
              },
            ]}
          />
          <div style={{ marginBottom: '1rem' }}>
            <div>
              <Field
                placeholder="$45/hr"
                style={{ marginRight: '1rem' }}
                name="minRate"
                type="number"
                component={FieldInputComponent}
              />
              {'  '}
              to{'  '}
              <Field
                placeholder="$95/hr"
                style={{ marginRight: '1rem' }}
                name="maxRate"
                type="number"
                component={FieldInputComponent}
              />
            </div>
            <small>Write a range for your budget (Ex. $4,500 - 8,500)</small>
          </div>
          <Field
            name="jobType"
            label="Job Type"
            type="radiogroups"
            component={FieldComponent}
            options={[
              {
                id: 'radio4',
                label: 'Contract',
                value: 'contract',
              },
              {
                id: 'radio5',
                label: 'Full-Time',
                value: 'full-time',
              },
              {
                id: 'radio6',
                label: 'Part-Time',
                value: 'part-time',
              },
            ]}
          />
          <Field
            name="locationAndTimezone"
            required={false}
            label="Location and Timezone resrictions"
            component={FieldComponent}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
            }}
          >
            <span>
              Total:<Price> $89.99 </Price>
            </span>
            <Next type="submit">
              <span style={{ marginRight: '5px' }}>Enter your info </span>
              <ArrowNext />
            </Next>
          </div>
        </Form>
      )}
    />
  );
};

EnterGigDetails.propTypes = {
  next: PropTypes.func.isRequired,
};

export default EnterGigDetails;
