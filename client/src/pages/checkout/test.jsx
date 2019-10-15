/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import getConfig from 'next/config';
import { ORDER } from '../../graphql/checkout';

const { publicRuntimeConfig } = getConfig();

const Test = () => {
  const apolloClient = useApolloClient();
  const [createOrder] = useMutation(ORDER);
  // eslint-disable-next-line prefer-destructuring
  const paypalCDN = publicRuntimeConfig.paypalCDN;
  // console.log(publicRuntimeConfig);
  // console.log(paypalCDN);

  useEffect(() => {
    window.apolloClient = apolloClient;
    const { paypal } = window;
    // console.log('apolloClient', apolloClient);
    const button = paypal.Buttons({
      createOrder: async (data, actions) => {
        console.log('the data: ', data);
        console.log('the action: ', actions);
        try {
          // const { data: orderData } = await apolloClient.mutate({
          //   mutation: ORDER,
          //   variables: { items: ['test'] },
          // });

          const res = await createOrder({ variables: { items: ['sdfasdf'] } });

          console.log('result data: ', res);
          return res.data.order;
        } catch (e) {
          console.log('e', e);
          console.log(e.toJSN());
          console.log(e.message);

          throw e;
        }
      },
      onApprove: (data, actions) => {
        console.log('transaction complete details: ', data);
        console.log(actions);
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

export default Test;
