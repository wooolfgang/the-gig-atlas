/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useApolloClient } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import getConfig from 'next/config';
import { ORDER_CREATE, ORDER_COMPLETE } from '../../graphql/checkout';
import { ALL_PRODUCTS } from '../../graphql/product';

const { publicRuntimeConfig } = getConfig();

/**
 * THIS FILE FOR TEST PURPOSE ONLY
 */

const Test = ({ products }) => {
  const apolloClient = useApolloClient();
  // const [createOrder] = useMutation(ORDER_CREATE);
  // eslint-disable-next-line prefer-destructuring
  const paypalCDN = publicRuntimeConfig.paypalCDN;
  // console.log(publicRuntimeConfig);
  // console.log(paypalCDN);

  useEffect(() => {
    // window.apolloClient = apolloClient;
    const { paypal } = window;
    // console.log('apolloClient', apolloClient);
    const button = paypal.Buttons({
      createOrder: async () => {
        try {
          const items = products.map(p => p.id);
          const {
            data: { order: orderId },
          } = await apolloClient.mutate({
            mutation: ORDER_CREATE,
            variables: { items },
          });
          console.log('created order: ', orderId);

          return orderId;
        } catch (e) {
          console.log('e', e);
          console.log(e.toJSN());
          console.log(e.message);

          throw e;
        }
      },
      onApprove: async data => {
        const { orderID, payerID } = data;
        const {
          data: { completeOrder },
        } = await apolloClient.mutate({
          mutation: ORDER_COMPLETE,
          variables: { orderId: orderID },
        });

        console.log('order is complete: ', completeOrder);
      },
    });

    button.render('#pay-btn');
  });

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <script src={paypalCDN} sync="true" />
      <div id="pay-btn" />
    </>
  );
};

Test.getInitialProps = async ({ apolloClient }) => {
  try {
    const { data } = await apolloClient.query({ query: ALL_PRODUCTS });
    // const { products } = data;

    return data;
  } catch (e) {
    console.log('failed to query products: \n', e);
    return {};
  }
};

export default Test;
