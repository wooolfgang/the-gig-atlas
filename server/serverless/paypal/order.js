/* eslint-disable import/prefer-default-export */
import { request } from './connect';
import util from './util';

const url = '/v2/checkout/orders';
const baseReqData = {
  intent: 'CAPTURE',
  application_context: {
    brand_name: 'The Gig Atlas',
    shipping_preference: 'NO_SHIPPING',
    user_action: 'PAY_NOW',
  },
};

/**
 * Creates order for employer new gig post
 * @param {Array<OrderItems>} items array of order items for gig post
 * @param {Object} payor object containing email and name of payee
 * @param {String} payor.name payee name
 * @param {String} payor.email payee email
 * @return {string} The ID necessary for client SDK to make payee input payment
 */
export async function createOrder(items, payor) {
  // const url = 'https://api.sandbox.paypal.com/v2/checkout/orders';
  const [unit, totalPrice] = util.processPurchaseUnit(items);
  const dataBody = {
    ...baseReqData,
    payer: {
      name: payor.name,
      email_address: payor.email,
    },
    purchase_units: [unit],
  };

  const config = {
    url,
    method: 'post',
    data: dataBody,
  };

  try {
    const { data } = await request(config);
    const { id: orderId } = data;

    return [orderId, totalPrice];
  } catch (e) {
    util.debugError(e);
    throw e;
  }
  // [ref]=> https://developer.paypal.com/docs/api/orders/v2/#orders_create
}

/**
 * @note no apparent use right now, see capture instead
 * Authorize order after customer approve their payment
 * @param {String} orderId the order id of customers approved payment
 */
export async function authorizePayment(orderId) {
  const config = {
    url: `${url}/${orderId}/authorize`,
    method: 'post',
  };

  try {
    const { data } = await request(config);

    return data;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
  // [ref] => https://developer.paypal.com/docs/api/orders/v2/#orders_authorize
}

/**
 * Capture approved order to be COMPLETED
 * @param {String} orderId order id from paypal
 */
export async function capturePayment(orderId) {
  const config = {
    url: `${url}/${orderId}/capture`,
    method: 'post',
  };

  try {
    const { data } = await request(config);

    return data;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
}

/**
 * Query signle order record by id
 * @param {String} orderId order id from paypal
 */
export async function selectOrder(orderId) {
  const config = {
    url: `${url}/${orderId}`,
    method: 'get',
  };

  try {
    const { data } = await request(config);

    return data;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
}

export default {
  createOrder,
  authorizePayment,
  selectOrder,
  capturePayment,
};
