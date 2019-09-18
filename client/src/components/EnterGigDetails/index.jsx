import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Input, FieldError, FieldHelp } from '../../primitives';
import CustomField from '../CustomField';
import { Price, Next, RateContainer } from './style';

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

const FieldInputComponent = ({
  field,
  form: { touched, errors },
  ...props
}) => {
  const error = touched[field.name] && errors[field.name];
  return (
    <div>
      <Input {...field} {...props} />
      <FieldError visible={!!error} value={error} />
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
            component={CustomField}
          />
          <Field
            name="description"
            type="textarea"
            label="Description"
            component={CustomField}
          />
          <Field
            name="projectType"
            component={CustomField}
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
            component={CustomField}
          />
          <Field
            name="paymentType"
            label="Payment Type"
            type="radiogroups"
            component={CustomField}
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
            <FieldHelp
              value="Write a range for your budget (Ex. $4,500 - 8,500)"
              visible
            />
          </div>
          <Field
            name="jobType"
            label="Job Type"
            type="radiogroups"
            component={CustomField}
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
            component={CustomField}
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
