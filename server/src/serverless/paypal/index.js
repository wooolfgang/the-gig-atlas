/**
 * Paypal checkout sesrvice
 * Order - one time payment
 * Subscription - concurrently paid based on plan selected
 * Plan - referenced by subscription that contains products details
 * Products - items/services provided by app
 */

import request from './connect';
import order from './order';

export default {
  request,
  order,
};
