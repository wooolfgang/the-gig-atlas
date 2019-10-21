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

function _setListQueryURL(query) {
  const concats = Object.keys(query).reduce(
    (queries, field) => queries.concat(`&${field}=${query[field]}`),
    '',
  );

  return `${url}?total_required=true${concats}`;
}

export async function listPlans(query) {
  const config = {
    url: _setListQueryURL(query),
    method: 'get',
  };

  try {
    const { data } = await request(config);
    // const { total_items, total_pages, products } = data;

    // return orderId;
    return data;
  } catch (e) {
    util.debugError(e);
    throw e;
  }
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

export async function updatePricing(id) {
  const config = {
    url: `${url}/${id}/update-pricing-schemes`,
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
