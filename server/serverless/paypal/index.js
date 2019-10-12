/* eslint-disable no-console */
/* eslint-disable import/named */
/* eslint-disable no-unreachable */
import axios from 'axios';
import { payment, isDev } from '../../src/config';
import util from './util';

if (!payment || !payment.paypal) {
  throw new Error('No payment Paypal config found');
  process.exit(1);
}

const { id: clientId, secret: clientSecret, uri } = payment.paypal;
let auth;

if (!clientId || !clientSecret || !uri) {
  throw new Error(`Invalid Paypal config value(s): ${payment}`);
  process.exit(1);
}

const request = axios.create({
  baseURL: uri,
  headers: {
    // Authorization: `Basic ${clientId}:${clientSecret}`,
    // Authorization:
      // 'Bearer A21AAG5OJxFnteBHPvXD2YsLqxeHQWPFEGTQoxXO49ObCa6Y1CVjA6TlhVixdVRbTTrQcTpWdi9bEuaLuMoZLFiryyEQlK7gQ',
    'Content-Type': 'application/json',
    // 'Content-type': 'application/x-www-form-urlencoded',
    'Accept-Language': 'en_US',
  },
  auth: { username: clientId, password: clientSecret },
});

export function getCDN() {
  return `https://www.paypal.com/sdk/js?currency=USD&client-id=${
    isDev ? 'sb' : clientId // => set sandbox (sb) on dev
  }`;
}

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
  const dataBody = {
    intent: 'CAPTURE',
    purchase_units: [util.processPurchaseUnit(items)],
    payer: {
      name: payor.name,
      email_address: payor.email,
    },
    /**
     * @todo: setup application_context property
     */
  };
  console.log('data body', dataBody);
  const { amount, items: itemses } = dataBody.purchase_units[0];
  console.log('amount >', amount);
  console.log('items >', itemses);

  const config = {
    url: '/v2/checkout/orders',
    method: 'post',
    data: dataBody,
  };

  try {
    const { data } = await request(config);
    const { id: orderId, status, create_time } = data;
    console.log('The order create result: ', data);

    return orderId;
  } catch (e) {
    if (e.response) {
      console.log(e.response.data);
      console.log('error on paypal order: ', e.toJSON());
    } else {
      console.log(e);
    }
    throw e;
  }
  // [ref]=> https://developer.paypal.com/docs/api/orders/v2/#orders_create
}

// /**
//  * Handle on payment completion
//  * @param {String} id order id
//  */
// export async function completePayment(id) {
//   const
// }

/**
 * Query oauth2 token from paypal
 * @returns Object { access_token, token_type, app_id, expires_in, nonce, scope(omitted) }
 */
export async function getToken() {
  // => paypal only supports v1 oauth2
  const url = `${uri}/v1/oauth2/token?grant_type=client_credentials`;
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept-Language': 'en_US',
    },
    auth: { username: clientId, password: clientSecret },
  };
  try {
    const { data } = await axios.post(url, {}, config);
    // eslint-disable-next-line no-unused-vars
    const { scope, ...rest } = data;
    console.log(rest);
    auth = rest;

    return auth;
  } catch (e) {
    console.log('ERROR on paypal authentication');
    console.log(e.response.data);

    throw e;
  }
}

export default {
  getCDN,
  createOrder,
  getToken,
  // capturePayment,
};
