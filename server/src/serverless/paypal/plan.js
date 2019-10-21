/* eslint-disable import/prefer-default-export */
import request from './connect';
import util from './util';

const url = '/v1/billing/plans';

function _validatePlan(plan) {

  return plan;
}

export async function createPlan(plan) {
  const validated = _validatePlan(plan);
  const dataBody = {
    ...validated,
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
    // util.debugError(e);
    throw e;
  }
}
