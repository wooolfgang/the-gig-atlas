/* eslint-disable prettier/prettier */
/**
 * Paypal checkout sesrvice
 * Order - one time payment
 * Subscription - concurrently paid based on plan selected
 * Plan - referenced by subscription that contains products details
 * Products - items/services provided by app
 */

import request from './connect';
import order from './order';
import plan from './plan';
import product from './product';
import subscription from './subscription';

export default {
  request,
  order,
  plan,
  product,
  subscription,
};

export {
  request,
  order,
  plan,
  product,
  subscription,
};
