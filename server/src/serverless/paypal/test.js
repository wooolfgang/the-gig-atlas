/* eslint-disable jest/no-disabled-tests */
/* eslint-disable no-restricted-syntax */
import {
  createProduct,
  listProducts,
  showProduct,
  updateProduct,
} from './product';

import {
  createPlan,
  listPlans,
  showPlanDetail,
  activatePlan,
  deactivatePlan,
  updatePricing,
} from './plan';

import {
  createSubscription,
} from './subscription';

import { toMoney } from './util';

/**
 * Test queries data from Paypal developers sandbox api by internet
 * avg up to 10 seconds to run test
 */
describe.skip('Paypal API', () => {
  const insertedProd = {
    name: 'Gig Post',
    description: 'The standard gig post',
  };
  let prodId; // = 'PROD-3R491622GH226671W';
  let planId; // = 'P-97956232MM305144XLWXOMZY';
  let subsId; // = 'I-V6UM3M2DP2J6';

  it('creates new product', async () => {

    const data = await createProduct(insertedProd);
    const { id, name, description } = data;
    prodId = id;

    expect(name).toBe(insertedProd.name);
    expect(description).toBe(insertedProd.description);
  });

  it('list all products', async () => {
    const res = await listProducts(20, 1);
    expect(res.total_items).toBeGreaterThanOrEqual(1);
  });

  it('shows product by id', async () => {
    const prod = await showProduct(prodId);

    expect(prod.name).toBe(insertedProd.name);
    expect(prod.type).toBe('SERVICE');
    expect(prod.category).toBe('ONLINE_SERVICES');
  });

  it('updates products', async () => {
    const operation = {
      op: 'replace',
      path: '/description',
      value: 'Updated Gig description',
    };
    const prod = await updateProduct(prodId, operation);

    expect(prod.description).toBe(operation.value);
  });

  it('creates new plan', async () => {
    const firstTrialMonth = {
      tenure_type: 'TRIAL',
      sequence: 1,
      total_cycles: 1,
      frequency: {
        interval_unit: 'MONTH',
        interval_count: 1,
      },
    };
    const secondMonthRegular = {
      tenure_type: 'REGULAR',
      sequence: 2,
      total_cycles: 1,
      frequency: {
        interval_unit: 'MONTH',
        interval_count: 1,
      },
      pricing_scheme: {
        version: 1,
        fixed_price: toMoney(39.99),
      },
    };
    const create = {
      product_id: prodId,
      name: 'Trial First Gig Post',
      describe: 'One year plan with free trial on first month',
      status: 'ACTIVE',
      billing_cycles: [firstTrialMonth, secondMonthRegular],
    };
    const plan = await createPlan(create);
    planId = plan.id;

    expect(plan.product_id).toBe(prodId);
    expect(plan.name).toBe(create.name);
    expect(plan.status).toBe(create.status);
  });

  it('shows list of created plans', async () => {
    const res = await listPlans({ counts: 20 });

    expect(res.plans.length).toBeGreaterThanOrEqual(1);
  });

  it('shows plan detial', async () => {
    const res = await showPlanDetail(planId);

    expect(res.product_id).toBe(prodId);
  });

  it('creates new subscription', async () => {
    const user = {
      firstName: 'Johan',
      lastName: 'Doena',
      email: 'johan999@gmail.com',
    };
    const res = await createSubscription(planId, user);

    subsId = res.id;

    expect(res.status).toBe('APPROVAL_PENDING');
  });
});
