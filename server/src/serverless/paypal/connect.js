/* eslint-disable import/named */
/* eslint-disable no-unreachable */
import axios from 'axios';
import { payment } from '../../config';
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

const request = axios.create({
  baseURL: uri,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en_US',
  },
  auth: { username: clientId, password: clientSecret },
});

export default request;
