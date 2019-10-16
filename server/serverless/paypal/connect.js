/* eslint-disable no-unreachable */
import axios from 'axios';
import { payment, isDev } from '../../src/config';
// import util from './util';

if (!payment || !payment.paypal) {
  throw new Error('No payment Paypal config found');
  process.exit(1);
}

const { id: clientId, secret: clientSecret, uri } = payment.paypal;

if (!clientId || !clientSecret || !uri) {
  throw new Error(`Invalid Paypal config value(s): ${payment}`);
  process.exit(1);
}

export const request = axios.create({
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

/**
 * @todo: to be set staticly on client
 */
export function getCDN() {
  return `https://www.paypal.com/sdk/js?currency=USD&client-id=${
    isDev ? 'sb' : clientId // => set sandbox (sb) on dev
  }`;
}
