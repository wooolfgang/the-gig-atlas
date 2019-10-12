import paypal from '../../../serverless/paypal';

async function order() {
  // return paypal.createOrder(dummyItems, payor);

  /**
   * @todo: add order once backend works
   */
  return '';
}

export default {
  Query: {
    paypalCDN: () => paypal.getCDN(),
  },
  Mutation: {
    order,
  },
};
