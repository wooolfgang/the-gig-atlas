import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import common from '@shared/common';
import { Input, FieldError, FieldHelp } from '../../primitives';
import CustomField from '../CustomField';
import { Price, Next, RateContainer } from './style';
import Spinner from '../../primitives/Spinner';
import { GET_GIG_DETAILS } from '../../graphql/gig';

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

const FormContainer = ({ initialValues, loading, onSubmit }) => (
  <>
    {loading && (
      <div style={{ marginBottom: '1.5rem' }}>
        Checking cache... <Spinner />
      </div>
    )}
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={common.validation.gigInput}
      onSubmit={onSubmit}
      render={({ values }) => (
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
                value: 'GREENFIELD',
                title: 'Greenfield',
                description: 'A project that starts from scratch',
              },
              {
                value: 'MAINTENANCE',
                title: 'Maintenance/Features',
                description: 'A project that starts from scratch',
              },
              {
                value: 'CONSULTING',
                title: 'Consulting',
                description: 'A project that starts from scratch',
              },
              {
                value: 'TESTING',
                title: 'Testing',
                description:
                  'Testing product features, automated testing, etc.',
              },
            ]}
          />
          <Field
            label="Technologies"
            name="technologies"
            type="asyncselect"
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
                value: 'FIXED',
              },
              {
                id: 'radio2',
                label: 'Hourly',
                value: 'HOURLY',
              },
            ]}
          />
          <div style={{ marginBottom: '1rem' }}>
            <RateContainer>
              <Field
                placeholder="$45/hr"
                name="minFee"
                type="number"
                component={FieldInputComponent}
              />{' '}
              <span style={{ margin: '0px .5rem', padding: '0.4rem 0.4rem' }}>
                to
              </span>
              <Field
                placeholder="$95/hr"
                name="maxFee"
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
                value: 'CONTRACT',
              },
              {
                id: 'radio5',
                label: 'Full-Time',
                value: 'FULL_TIME',
              },
              {
                id: 'radio6',
                label: 'Part-Time',
                value: 'PART_TIME',
              },
            ]}
          />
          <Field
            name="locationRestriction"
            required={false}
            label="Location and Timezone resrictions"
            component={CustomField}
          />
          <Field
            name="communicationType"
            type="radiocards"
            label="How would you like to communicate with freelancers?"
            component={CustomField}
            options={[
              {
                value: 'EMAIL',
                title: 'Email',
                description: 'Direct freelancers to communicate via your email',
              },
              {
                value: 'WEBSITE',
                title: 'Website Link',
                description: 'Direct freelancers to a website of your choice',
              },
              {
                value: 'IN_APP',
                title: 'In App Chat',
                description:
                  'Use our own chat service to communicate with clients',
              },
            ]}
          />
          {values.communicationType === 'EMAIL' && (
            <Field
              name="communicationEmail"
              type="text"
              label="Email"
              help="The email for freelancers to contact you with"
              component={CustomField}
            />
          )}
          {values.communicationType === 'WEBSITE' && (
            <Field
              name="communicationWebsite"
              type="text"
              label="Website Link"
              help="The website link that you can direct applying freelancers"
              component={CustomField}
            />
          )}
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
              <img
                src="/static/arrow-right.svg"
                alt="arrow-right-icon"
                style={{ width: '1rem' }}
              />
            </Next>
          </div>
        </Form>
      )}
    />
  </>
);

FormContainer.propTypes = {
  initialValues: PropTypes.shape({}),
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
};

FormContainer.defaultProps = {
  initialValues: {},
  loading: false,
  onSubmit: () => {},
};

const FormGigDetails = ({ next }) => {
  const { data, loading, client } = useQuery(GET_GIG_DETAILS, {
    fetchPolicy: 'cache-first',
  });
  if (loading) return <FormContainer loading={loading} />;
  return (
    <FormContainer
      initialValues={
        data && data.gigData
          ? data.gigData
          : {
              title: '',
              description: '',
              projectType: '',
              technologies: [],
              paymentType: '',
              minFee: '',
              maxFee: '',
              jobType: '',
              locationRestriction: '',
              communicationType: '',
              communicationEmail: '',
              communicationWebsite: '',
            }
      }
      onSubmit={values => {
        client.writeData({
          data: {
            gigData: {
              ...values,
              __typename: 'gigData',
            },
          },
        });
        /* A little bit weird, but without setTimeout writing to cache doesn't get continued */
        setTimeout(() => {
          next();
        }, 1000);
      }}
    />
  );
};

FormGigDetails.propTypes = {
  next: PropTypes.func.isRequired,
};

export default FormGigDetails;
