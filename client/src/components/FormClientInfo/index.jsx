import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { gql } from 'apollo-boost';
import * as Yup from 'yup';
import { useQuery } from '@apollo/react-hooks';
import CustomField from '../CustomField';
import { Back, Next, Price } from '../FormGigDetails/style';
import Spinner from '../../primitives/Spinner';

export const ClientInfoSchema = Yup.object().shape({
  firstName: Yup.string('First Name must be a string').required(
    'First Name is required'
  ),
  lastName: Yup.string('Last Name must be a string').required(
    'Last Name is required'
  ),
  email: Yup.string('Email must be a string')
    .email('Please input correct email format ')
    .required('Email is required'),
  companyName: Yup.string('Company Name must be a string').required(
    'Company Name is required'
  ),
  companyDescription: Yup.string('Company Name must be a string').required(
    'Company Name is required'
  ),
  website: Yup.string('Website must be a string')
    .url('Please input proper website url')
    .required('Website url is required'),
  communicationType: Yup.string('Communication type must be a string').required(
    'Communication type is required'
  ),
  communicationEmail: Yup.string().when('communicationType', {
    is: val => val === 'email',
    then: Yup.string('Email must be a string')
      .email('Please input correct email format ')
      .required('Email is required'),
  }),
  communicationWebsite: Yup.string().when('communicationType', {
    is: val => val === 'website-link',
    then: Yup.string('Website must be a string')
      .url('Please input proper website url')
      .required('Website url is required'),
  }),
});

export const GET_CLIENT_INFO = gql`
  {
    clientInfo @client {
      firstName
      lastName
      email
      companyName
      companyDescription
      website
      communicationType
      communicationEmail
      communicationWebsite
    }
  }
`;

const FormContainer = ({ initialValues, loading, onSubmit, back }) => (
  <>
    {loading && (
      <div style={{ marginBottom: '1.5rem' }}>
        Loading cache... <Spinner />
      </div>
    )}
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={ClientInfoSchema}
      render={({ values }) => (
        <Form>
          <h2> Tell us about yourself</h2>
          <Field
            name="firstName"
            type="text"
            label="First Name"
            help="Your surname"
            component={CustomField}
          />
          <Field
            name="lastName"
            type="text"
            label="Last Name"
            help="Your given name"
            component={CustomField}
          />
          <Field
            name="email"
            type="text"
            label="Email"
            help="Your email will be used to login your personal account, and will not be shown in our listings"
            component={CustomField}
          />
          <Field
            name="companyName"
            type="text"
            label="Company Name"
            help="If you are an individual, you can enter your personal brand name"
            component={CustomField}
          />
          <Field
            name="companyDescription"
            type="textarea"
            label="Company Description"
            help="What does you company do, your goals, etc."
            component={CustomField}
          />
          <Field
            name="website"
            type="text"
            label="Website"
            help="If a company website is not available, you can enter your personal website"
            component={CustomField}
          />
          <Field
            name="communicationType"
            type="radiocards"
            label="How would you like to communicate with freelancers?"
            component={CustomField}
            options={[
              {
                value: 'email',
                title: 'Email',
                description: 'Direct freelancers to communicate via your email',
              },
              {
                value: 'website-link',
                title: 'Website Link',
                description: 'Direct freelancers to a website of your choice',
              },
              {
                value: 'in-app-chat',
                title: 'In App Chat',
                description:
                  'Use our own chat service to communicate with clients',
              },
            ]}
          />
          {values.communicationType === 'email' && (
            <Field
              name="communicationEmail"
              type="text"
              label="Email"
              help="The email for freelancers to contact you with"
              component={CustomField}
            />
          )}
          {values.communicationType === 'website-link' && (
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
            <div style={{ display: 'flex' }}>
              <Back type="button" onClick={back}>
                <span style={{ marginRight: '5px' }}>Back </span>
                <img
                  src="/static/corner-down-left.svg"
                  alt="back-icon"
                  style={{ width: '1rem' }}
                />
              </Back>
              <Next type="submit">
                <span style={{ marginRight: '5px' }}>Preview your post </span>
                <img
                  src="/static/arrow-right.svg"
                  alt="arrow-right-icon"
                  style={{ width: '1rem' }}
                />
              </Next>
            </div>
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
  back: PropTypes.func,
};

FormContainer.defaultProps = {
  initialValues: {},
  loading: false,
  back: () => {},
  onSubmit: () => {},
};

const FormClientInfo = ({ back, next }) => {
  const { data, loading, client } = useQuery(GET_CLIENT_INFO);
  if (loading) return <FormContainer loading />;
  return (
    <FormContainer
      initialValues={
        data
          ? data.clientInfo
          : {
              firstName: '',
              lastName: '',
              email: '',
              companyName: '',
              companyDescription: '',
              website: '',
              communicationType: '',
              communicationEmail: '',
              communicationWebsite: '',
            }
      }
      back={back}
      onSubmit={values => {
        client.writeData({
          data: {
            clientInfo: {
              ...values,
              __typename: 'clientInfo',
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

FormClientInfo.propTypes = {
  back: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
};

export default FormClientInfo;
