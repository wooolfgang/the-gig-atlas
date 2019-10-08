import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { Formik, Field, Form } from 'formik';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as Yup from 'yup';
import common from '@shared/common';
import CustomField from '../CustomField';
import { Price, Next, Back } from '../FormGigDetails/style';
import { GET_IMAGE } from '../../graphql/file';
import Spinner from '../../primitives/Spinner';
import GigCard from '../GigCard';
import {
  GET_GIG_DETAILS,
  GET_CLIENT_INFO,
  CREATE_GIG,
} from '../../graphql/gig';

const CreditCardSchema = Yup.object().shape({
  fullName: Yup.string('Full name must be a string').required(
    'Full Name is required',
  ),
  cardNumber: Yup.number('Card number must be a number').required(
    'Card number is required',
  ),
  expiryDate: Yup.string('Expiry date must be a string').required(
    'Expiry date is required',
  ),
  ccv: Yup.string('CCV must be a string').required('CCV is required'),
  zipOrPostal: Yup.string('Zip or postal be a string').required(
    'Zip or postal is required',
  ),
});

const FormPurchase = ({ back }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { data: gigData, loading } = useQuery(GET_GIG_DETAILS, {
    fetchPolicy: 'cache-first',
  });
  const { data: clientData } = useQuery(GET_CLIENT_INFO, {
    fetchPolicy: 'cache-first',
  });
  const { data: image, loading: loading3 } = useQuery(GET_IMAGE, {
    variables: {
      id:
        clientData &&
        clientData.employerData &&
        clientData.employerData.avatarFileId,
    },
    fetchPolicy: 'cache-first',
  });
  const [createGig, { client }] = useMutation(CREATE_GIG);
  return (
    <Formik
      enableReinitialize
      onSubmit={async () => {
        setSubmitting(true);
        /* eslint-disable no-unused-vars */
        const { __typename: noUseVar1, ...gig } = gigData.gigData;
        const { __typename: noUseVar2, ...employer } = clientData.employerData;
        const input = {
          gig,
          employer,
        };
        const isValid = await common.validation.createGigInput.isValid(input);
        if (isValid) {
          await createGig({
            variables: input,
          });
          client.writeData({
            data: {
              employerData: null,
              gigData: null,
            },
          });
          setTimeout(() => {
            Router.push('/');
          }, 1000);
        } else {
          alert('Incomplete data!');
        }

        setSubmitting(false);
      }}
      validationSchema={CreditCardSchema}
      initialValues={{
        fullName: '',
        cardNumber: '',
        expiryDate: '',
        ccv: '',
        zipOrPostal: '',
      }}
      render={() => (
        <Form>
          <h2>Start reaching out to talented developers</h2>
          <Field
            name="fullName"
            type="text"
            label="Full Name"
            component={CustomField}
          />
          <Field
            name="cardNumber"
            type="text"
            label="Card Number"
            component={CustomField}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Field
              name="expiryDate"
              type="date"
              label="Expiry Date"
              inputStyle={{ flex: 1, marginRight: '1.75rem' }}
              labelStyle={{ height: '2rem' }}
              component={CustomField}
            />
            <Field
              name="ccv"
              type="text"
              inputStyle={{ flex: 1, marginRight: '1.75rem' }}
              labelStyle={{ height: '2rem' }}
              label="CCV"
              component={CustomField}
            />
            <Field
              name="zipOrPostal"
              type="text"
              label="Zip/Postal"
              inputStyle={{ flex: 1 }}
              labelStyle={{ height: '2rem' }}
              component={CustomField}
            />
          </div>
          <div style={{ width: '75%', margin: 'auto', padding: '1.5rem 0' }}>
            <p>Preview your ad one last time</p>
            {loading || loading3 ? (
              <Spinner />
            ) : (
              <GigCard
                gig={
                  gigData && {
                    ...gigData.gigData,
                    employer: {
                      avatar: {
                        url: image && image.file.url,
                      },
                    },
                  }
                }
              />
            )}
          </div>
          <p>
            You’ll be charged $388 every 30 days while this job is active. After
            each renewal, your ad will appear on the home page and will return
            to the top of the feed until the job is filled or cancelled.
            Subscription can be cancelled anytime through the receipt emailed
            after purchase.
          </p>
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
                <span style={{ marginRight: '5px' }}>Publish </span>
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <img
                    src="/static/arrow-right.svg"
                    alt="arrow-right-icon"
                    style={{ width: '1rem' }}
                  />
                )}
              </Next>
            </div>
          </div>
        </Form>
      )}
    />
  );
};

FormPurchase.propTypes = {
  back: PropTypes.func.isRequired,
};

export default FormPurchase;
