/* eslint-disable no-restricted-syntax */
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

/**
 * Type PlanStdInput
 * @typedef {Object} PlanStdInput
 * @property {string} prodId - product id from paypal db
 * @property {string} codename - plan unique codename
 * @property {string} description - plan detail description
 * @property {number} monthlyCharge - plan monthly charge
 */

/**
 * Encapsulated Create plan with pre-made standard value
 * Plan is automatically set to ACTIVATED
 * @param {PlanStdInput} input - plan pbject
 */
export function createStdPlan(input) {
  const { prodId, codename, description, monthlyCharge } = input;
  // [] => Shows standard monthly billing cycle
  const monthlyCycle = {
    tenure_type: 'REGULAR',
    sequence: 1,
    total_cycles: 12,
    frequency: {
      interval_unit: 'MONTH',
      interval_count: 1,
    },
    pricing_scheme: {
      version: 1,
      fixed_price: util.toMoney(monthlyCharge),
    },
  };
  const create = {
    description,
    name: codename,
    product_id: prodId,
    status: 'ACTIVE',
    billing_cycles: [monthlyCycle],
  };

  return createPlan(create);
}

/**
 * Type PlanCustomInput
 * @typedef {Object} PlanCustomInput
 * @property {string} prodId - product id from paypal db
 * @property {string} codename - plan unique codename
 * @property {string} description - plan detail description
 * @property {number} totalCycles - charge frequency cycles
 * @property {string} intervalUnit - [DAY|WEEK|MONTH|YEAR]
 * @property {number} intervlCount - interval count after subscription billed
 * @property {number} charge - charge amount per subscription
 */

/**
 * Encapsulated Create plan with custom value
 * Plan is automatically set to ACTIVATED
 * @param {PlanCustomInput} input - plan pbject
 */
export function createCustomPlan(input) {
  const {
    prodId,
    codename,
    description,
    charge,
    totalCycles,
    intervalUnit,
    intervlCount,
  } = input;
  const cycle = {
    tenure_type: 'REGULAR',
    sequence: 1,
    total_cycles: totalCycles,
    frequency: {
      interval_unit: intervalUnit,
      interval_count: intervlCount,
    },
    pricing_scheme: {
      version: 1,
      fixed_price: util.toMoney(charge),
    },
  };
  const create = {
    description,
    name: codename,
    product_id: prodId,
    status: 'ACTIVE',
    billing_cycles: [cycle],
  };

  return createPlan(create);
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
async function listPlans(query) {
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

function _listPlansIter(pageSize = 10, pagePos = 1) {
  return {
    pageSize,
    pagePos,
    [Symbol.asyncIterator]() {
      let currentPos = this.pagePos;
      let isDone = false;

      return {
        async next() {
          if (isDone) {
            return { done: true };
          }

          const data = await listPlans({ counts: pageSize, page: currentPos });
          const { total_items } = data;

          isDone = pageSize * currentPos >= total_items;
          currentPos += pagePos;

          return {
            done: false,
            value: data,
          };
        },
      };
    },
  };
}

listPlans.iter = _listPlansIter;

export { listPlans };

/**
 * Create or find plan return obj
 * @typedef {Object} DuplicatePlan
 * @property {Object} plan - the plan obj
 * @property {boolean} isDubplicate - return if plan already exist
 */

/**
 * Create new standard plan if there is no dupblicate
 * returns the duplicate plan if exist
 * @param {PlanStdInput | PlanCustomInput} input - plan pbject
 * @param {boolean} isStd - [isStd=true] use standard creation, false for custom
 * @returns {Promise<DuplicatePlan>}
 */
export async function createOrFindPlan(input, isStd = true) {
  const plansIter = _listPlansIter(10);
  const { codename } = input;

  for await (const { plans } of plansIter) {
    const current = plans.find(plan => plan.name === codename);
    if (current) {
      return { plan: current, isDuplicate: true };
    }
  }

  const createPromise = isStd ? createStdPlan(input) : createCustomPlan(input);

  return createPromise.then(p => ({ plan: p, isDuplicate: false }));
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

export default {
  createPlan,
  createStdPlan,
  listPlans,
  createOrFindPlan,
  showPlanDetail,
  activatePlan,
  deactivatePlan,
  updatePricing,
};
