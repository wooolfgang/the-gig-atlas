import React from 'react';
import PropTypes from 'prop-types';
import common from '@shared/common';
import { Formik, Form, Field } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import CustomField from '../CustomField';
import { Back, Next, Price } from '../FormGigDetails/style';
import Spinner from '../../primitives/Spinner';
import { GET_CLIENT_INFO } from '../../graphql/gig';

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
      validationSchema={common.validation.employerInput}
      render={() => (
        <Form>
          <h2> Tell us about yourself</h2>
          <Field
            name="email"
            type="text"
            label="Email"
            help="Your email will be used to login your personal account, and will not be shown in our listings"
            component={CustomField}
          />
          <Field
            name="employerType"
            type="radiocards"
            label="You can post as an individual or a company"
            component={CustomField}
            options={[
              {
                value: 'PERSONAL',
                title: 'Personal',
                description: "You're hiring directly for yourself",
              },
              {
                value: 'COMPANY',
                title: 'Company',
                description: "You're hiring for your company",
              },
            ]}
          />
          <Field
            name="displayName"
            type="text"
            label="Display Name"
            help="This can be your company or personal name"
            component={CustomField}
          />

          <Field
            name="introduction"
            type="textarea"
            label="Introduction"
            help="What does you company do, your visions, etc."
            component={CustomField}
          />
          <Field
            name="avatarFileId"
            label="Avatar"
            help="Your avatar will be shown in your gig posting"
            type="avatarupload"
            component={CustomField}
          />
          <Field
            name="website"
            type="text"
            label="Website"
            help="Enter your company or personal website"
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
  const { data, loading, client } = useQuery(GET_CLIENT_INFO, {
    fetchPolicy: 'cache-first',
  });
  if (loading) return <FormContainer loading />;

  return (
    <FormContainer
      initialValues={
        data && data.employerData
          ? data.employerData
          : {
              displayName: '',
              website: '',
              introduction: '',
              email: '',
              employerType: '',
              avatarFileId: '',
            }
      }
      back={back}
      onSubmit={values => {
        client.writeData({
          data: {
            employerData: {
              ...values,
              __typename: 'employerData',
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
