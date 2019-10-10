/* eslint-disable import/named */
/* eslint-disable no-unreachable */
import axios from 'axios';
import { payment, isDev } from '../../src/config';
import util from './util';

if (!payment) {
  throw new Error('No payment config found');
  process.exit(1);
}

const { id, secret, uri } = payment;

if (!id || !secret || !uri) {
  throw new Error(`Invalid Paypal config value(s): ${payment}`);
  process.exit(1);
}

const ContentType = 'application/json';
const Authorization = `Basic ${id}:${secret}`;

export function getCDN() {
  return `https://www.paypal.com/sdk/js?currency=USD&client-id=${
    isDev ? 'sb' : id // => set sandbox (sb) on dev
  }`;
}

/**
 * Creates order for employer new gig post
 * @param {Array<OrderItems>} items array of order items for gig post
 * @return {string} The ID necessary for client SDK to make payee input payment
 */
export async function createOrder(items, user) {
  // const url = 'https://api.sandbox.paypal.com/v2/checkout/orders';
  const url = `${uri}/v2/checkout/orders`;
  const dataBody = {
    intent: 'CAPTURE',
    purchase_units: [util.processPurchaseUnit(items)],
    payer: {
      name: user.name,
      email_address: user.email,
    },
    /**
     * @todo: setup application_context property
     */
  };
  const config = {
    headers: { Authorization, 'Content-Type': ContentType },
  };

  try {
    const { data } = await axios.post(url, dataBody, config);
    const { id: orderId, status, create_time } = data;
    console.log('The order create result: ', data);

    return orderId;
  } catch (e) {
    console.log('error on paypal order: ', e);
    throw e;
  }
  // [ref]=> https://developer.paypal.com/docs/api/orders/v2/#orders_create
}

/**
 * Handle on payment completion
 * @param {String} id order id
 */
export async function completePayment(id) {
  const 
}

export default {
  createOrder,
  capturePayment,
};
