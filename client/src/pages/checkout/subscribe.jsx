/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useApolloClient } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import getConfig from 'next/config';
import { SUBSCRIBE, APPROVE_SUBSCRIPTON } from '../../graphql/subscription';

const { publicRuntimeConfig } = getConfig();

/**
 * THIS FILE FOR TEST PURPOSE ONLY
 */

const Test = ({ paypalCDN }) => {
  const apolloClient = useApolloClient();
  // eslint-disable-next-line prefer-destructuring

  useEffect(() => {
    // window.apolloClient = apolloClient;
    const { paypal } = window;

    if (!paypal) {
      /**
       * @todo handle not available paypal
       */
      console.error('Paypal not available!');
      return;
    }
    // console.log('apolloClient', apolloClient);
    const button = paypal.Buttons({
      createSubscription: async () => {
        try {
          const {
            data: { subscribe },
          } = await apolloClient.mutate({
            mutation: SUBSCRIBE,
            variables: { planCode: 'daily-test-plan' },
          });
          console.log('on create subscription: ', subscribe.id);

          return subscribe.id;
        } catch (e) {
          console.log('e', e);
          console.log(e.toJSN());
          console.log(e.message);

          throw e;
        }
      },
      onApprove: async approveRes => {
        console.log('approve data', approveRes);
        //  orderID: "7P2800002S211605P", subscriptionID: "I-VDEU4K0GU91C"
        const { subscriptionID, orderID } = approveRes;
        const res = await apolloClient.mutate({
          mutation: APPROVE_SUBSCRIPTON,
          variables: { serviceId: subscriptionID, orderId: orderID },
        });
        const { approveSubscription } = res.data;
        console.log('confirmation res: ', approveSubscription);
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
  // eslint-disable-next-line prefer-destructuring
  const paypalCDN = `${publicRuntimeConfig.paypalCDN}&vault=true`;

  return { paypalCDN };
};

export default Test;
