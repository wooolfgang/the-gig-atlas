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
    payment_preferences: {
      auto_bill_outstanding: true,
      payment_failure_threshold: 3,
    },
    quantity_supported: false,
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

function _setListQueryURL({ prodId, planIds, counts, page }) {
  let qurl = `${url}?total_required=true`;
  qurl = prodId ? qurl.concat(`&product_id=${prodId}`) : qurl;
  qurl = planIds ? qurl.concat(`&plan_ids=${planIds}`) : qurl;
  qurl = counts ? qurl.concat(`&page_size=${counts}`) : qurl;
  qurl = page ? qurl.concat(`&page=${page}`) : qurl;

  return qurl;
}

/**
 * Query plans
 * @param {Object} query - query obj
 * @param {string} query.prodId - filters by product id
 * @param {string} query.planIds - Filters the response by list of plan IDs up to 10.
 * @param {number} query.counts -  The number of items to return in the response. default: 10
 * @param {number} query.page - offset page position, starts at 1: default 1
 */
export async function listPlans(query) {
  const config = {
    url: _setListQueryURL(query),
    method: 'get',
  };

  try {
    const { data } = await request(config);

    return data;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
  // [ref]=> https://developer.paypal.com/docs/api/subscriptions/v1/#plans_list
}

export async function showPlanDetail(id) {
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

export async function activatePlan(id) {
  const config = {
    url: `${url}/activate/${id}`,
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

export async function deactivatePlan(id) {
  const config = {
    url: `${url}/deactivate/${id}`,
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
 * Update pricing of plan
 * @param {string} id - plan id
 * @param {Object} priceScheme pricing schem obj
 */
export async function updatePricing(id, priceScheme) {
  const config = {
    url: `${url}/${id}/update-pricing-schemes`,
    method: 'post',
    data: {
      pricing_schemes: [priceScheme],
    },
  };

  try {
    const { data } = await request(config);

    return data;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
  // [ref] => https://developer.paypal.com/docs/api/subscriptions/v1/#plans_update-pricing-schemes
}
