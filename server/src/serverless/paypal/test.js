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

describe('Paypal API', () => {
  let prodId = 'PROD-3R491622GH226671W';
  let planId = 'P-97956232MM305144XLWXOMZY';

  it.skip('creates new product', async () => {
    const product = {
      name: 'Gig Post',
      description: 'The standard gig post',
    };

    const res = await createProduct(product);
    console.log(res);
  });

  it.skip('list all products', async () => {
    const products = listProducts();

    for await (const prod of products) {
      console.log(prod);
    }
  });

  it.skip('shows product by id', async () => {
    const prod = await showProduct('PROD-3R491622GH226671W');
    console.log(prod);
  });

  it.skip('updates products', async () => {
    const id = 'PROD-3R491622GH226671W';
    const operation = {
      op: 'replace',
      path: '/description',
      value: 'Updated Gig description',
    };
    const prod = await updateProduct(id, operation);
    console.log(prod);
  });

  it.skip('creates new plan', async () => {
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
    // const restRegular = {
    //   tenure_type: 'REGULAR',
    //   sequence: 3,
    //   total_cycles: 10,
    //   frequency: {
    //     interval_unit: 'MONTH',
    //     interval_count: 1,
    //   },
    //   pricing_scheme: {
    //     version: 1,
    //     fixed_price: toMoney(34.99),
    //   },
    // };
    const create = {
      product_id: 'PROD-3R491622GH226671W',
      name: 'Trial First Gig Post',
      describe: 'One year plan with free trial on first month',
      status: 'ACTIVE',
      billing_cycles: [firstTrialMonth, secondMonthRegular],
    };
    const plan = await createPlan(create);

    console.log(plan); // -> id: P-97956232MM305144XLWXOMZY
  });

  it.skip('shows list of created plans', async () => {
    const plans = await listPlans({ page_size: 20 });
    console.log(plans);
  });

  it.skip('shows plan detial', async () => {
    const res = await showPlanDetail('P-97956232MM305144XLWXOMZY');
    console.log(res);
  });

  // subscription

  it.skip('creates new subscription', async () => {
    const user = {
      firstName: 'Johan',
      lastName: 'Doena',
      email: 'johan999@gmail.com',
    };
    const res = await createSubscription(planId, user);
    console.log(res);
  });
});
