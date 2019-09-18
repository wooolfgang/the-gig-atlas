import React from 'react';
import styled, { css } from 'styled-components';
import { animated, useTransition } from 'react-spring';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import media from '../../utils/media';

const InputStyles = css`
  box-sizing: border-box;
  font-size: 1rem;
  border: none;
  box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.color.d6};
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
    display: block;
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
  min-height: 100px;
  padding: 0.75rem 0.75rem;
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

const Help = styled(animated.span)`
  display: block;
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const Error = styled(animated.span)`
  display: block;
  font-size: 0.8rem;
  opacity: 1;
  margin-top: 0.5rem;
  color: ${props => props.theme.color.e1};
`;

const RateContainer = styled.div`
  display: flex;

  ${media.phone`
    flex-direction: column;
  `};
`;

const HelpMessage = ({ value, visible }) => {
  const transitions = useTransition(visible, null, {
    from: { opacity: 0, transform: 'translateY(0rem)' },
    enter: { opacity: 0.75, transform: 'translateY(-0.2rem)' },
    leave: { opacity: 0, transform: 'translateY(.2rem)' },
  });
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <Help key={key} style={props}>
          {value}
        </Help>
      )
  );
};

HelpMessage.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
};

HelpMessage.defaultProps = {
  value: '',
  visible: true,
};

const ErrorMessage = ({ value, visible }) => {
  const transitions = useTransition(visible, null, {
    from: { transform: 'translateX(0rem)' },
    enter: () => async next => {
      await next({ transform: 'translateX(-0.3px)' });
      await next({ transform: 'translateX(0.4px)' });
      await next({ transform: 'translateX(0px)' });
    },
    leave: { transform: 'translateX(0rem)' },
    config: {
      mass: 1,
      tension: 500,
      friction: 26,
      duration: 100,
    },
  });
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <Error key={key} style={props}>
          {value}
        </Error>
      )
  );
};

ErrorMessage.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
};

ErrorMessage.defaultProps = {
  value: '',
  visible: true,
};

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
  help,
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

  const error = touched[field.name] && errors[field.name];

  return (
    <>
      <Label htmlFor={field.name}>
        <span id="label">
          {label} {!required && <small>(optional)</small>}
        </span>
        <InputComponent {...field} type={type} {...props} />
        {!error && <HelpMessage visible={!!help} value={help} />}
        <ErrorMessage visible={!!error} value={error} />
      </Label>
    </>
  );
};

FieldComponent.propTypes = {
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

FieldComponent.defaultProps = {
  required: true,
  type: 'input',
  help: null,
};

const FieldInputComponent = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const error = touched[field.name] && errors[field.name];
  return (
    <div>
      <Input {...field} {...props} />
      <ErrorMessage visible={!!error} value={error} />
    </div>
  );
};

FieldInputComponent.propTypes = {
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
};

const GigDetailsSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Minimum of two characters')
    .max(25, 'Maximum limit for title')
    .required('Title is required'),
  description: Yup.string()
    .min(2, 'Minimum of two characters')
    .max(200, 'Maximum limit for description')
    .required('Description is required'),
  projectType: Yup.string().required('Project Type is required'),
  technologies: Yup.array()
    .min(1, 'Add at least one technology')
    .required('Technologies is required'),
  paymentType: Yup.string().required('Payment Type is required'),
  jobType: Yup.string().required('Job Type is required'),
  maxRate: Yup.number('maxRate must be a number')
    .positive('Rate should be greater than zero')
    .required('Maximum rate is required'),
  minRate: Yup.number('minRate must be a number')
    .positive('Rate should be greater than zero')
    .required('Minimum rate is required'),
  locationAndTimezone: Yup.string(),
});

const EnterGigDetails = ({ next }) => {
  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        projectType: '',
        technologies: [],
        paymentType: '',
        minRate: '',
        maxRate: '',
        jobType: '',
        locationAndTimezone: '',
      }}
      validationSchema={GigDetailsSchema}
      onSubmit={next}
      render={() => (
        <Form>
          <Field
            name="title"
            type="text"
            label="Title"
            help="Write a concise title that describes the job perfectly."
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
            <RateContainer>
              <Field
                placeholder="$45/hr"
                name="minRate"
                type="number"
                component={FieldInputComponent}
              />{' '}
              <span style={{ margin: '0px .5rem', padding: '0.4rem 0.4rem' }}>
                to
              </span>
              <Field
                placeholder="$95/hr"
                name="maxRate"
                type="number"
                component={FieldInputComponent}
              />
            </RateContainer>
            <HelpMessage
              value="Write a range for your budget (Ex. $4,500 - 8,500)"
              visible
            />
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
