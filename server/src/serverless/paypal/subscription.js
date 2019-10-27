import request from './connect';
import util from './util';

const url = '/v1/billing/subscriptions';

/**
 * Create a new subscription to be paid
 * @param {string} planId - corresponding plan id to subscribe
 * @param {Object} user - the user containing firstName, lastName and email
 */
export async function createSubscription(planId) {
  const dataBody = {
    plan_id: planId,
    application_context: {
      brand_name: 'The Gig Atlas',
      locale: 'en-US',
      shipping_preference: 'NO_SHIPPING',
      user_action: 'SUBSCRIBE_NOW',
    },
  };
  const config = {
    url,
    method: 'post',
    data: dataBody,
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
 * @todo: implement subscription update soon
 */
export async function update() {
  //
}

/**
 * Show details of subscription
 * @param {string} id subscription id
 */
export async function showSubscription(id) {
  const config = {
    url: `${url}/${id}`,
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

/**
 * Reactivate subscription of employer of cancelled subscription
 * @param {satring} id id of cancelled subscription
 */
export async function activateSubscripton(id, reason = 'Reactivation') {
  const config = {
    url: `${url}/${id}/activate`,
    method: 'post',
    data: { reason },
  };

  try {
    const { data } = await request(config);
    const { id: orderId } = data;

    return orderId;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
}

export async function cancelSubscription(id, reason = 'Ended') {
  const config = {
    url: `${url}/${id}/cancel`,
    method: 'post',
    data: { reason },
  };

  try {
    const { data } = await request(config);
    const { id: orderId } = data;

    return orderId;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
}

/**
 * not needed for now
 * @param {*} id
 * @param {*} capture
 */
export async function captureAuthorized(id, capture) {
  const config = {
    url: `${url}/${id}/capture`,
    method: 'post',
    data: {
      capture_type: 'OUTSTANDING_BALANCE',
      ...capture,
    },
  };

  try {
    const { data } = await request(config);
    const { id: orderId } = data;

    return orderId;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
}

/**
 * List all transaction of subscription from given time interval
 * @param {String} id subscription id
 * @param {String} startTime start of transaction
 * @param {String} endTime end of transaction
 */
export async function listTransactions(id, startTime, endTime) {
  const config = {
    url: `${url}/${id}/transactions?start_time=${startTime}&end_time=${endTime}`,
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

export async function showOrder(id) {
  // const config = {
  //   url: `${url}/${id}/transactions`,
  //   method: 'get',
  // };

  // try {
  //   const { data } = await request(config);

  //   return data;
  // } catch (e) {
  //   util.debugError(e);
  //   throw e;
  // }
}

export default {
  createSubscription,
  showSubscription,
  activateSubscripton,
  cancelSubscription,
  captureAuthorized,
  listTransactions,
};
