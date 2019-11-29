/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import paypal from '../src/serverless/paypal';
import { createOrFindPlan as localCreateOrFindPlan } from '../src/graphql/subscription/plan';

const {
  product: { createOrFindProduct },
  plan: { createOrFindPlan },
} = paypal;

export default async function regular() {
  try {
    // => create or find Product on paypal service
    const stdGigPostProd = {
      codename: 'basic-gig-post',
      description: 'Basic gig post product',
    };
    const prodRes = await createOrFindProduct(stdGigPostProd);

    // => create or find plan on paypal service
    const planInput = {
      prodId: prodRes.product.id,
      codename: 'basic-plan',
      description: 'Basic monthly charged plan',
      monthlyCharge: 29.99,
    };
    const planRes = await createOrFindPlan(planInput);

    // => create or find plan on local service
    const localInputPlan = {
      codename: planInput.codename,
      serviceId: planRes.plan.id,
      status: 'ACTIVE',
      cyclePrice: planInput.monthlyCharge,
      description: 'Basic standard plan for all gig post',
    };
    const localPlan = await localCreateOrFindPlan(localInputPlan);

    _printResult('Regular plan', prodRes, planRes, localPlan);
  } catch (e) {
    console.error('Error on inserting plan(s)\n', e);
    process.exit(1);
  }
}

export async function dailyTestPlan() {
  try {
    const stdGigPostProd = {
      codename: 'test-gig-post',
      description: 'Gig post for testing purpose',
    };
    const prodRes = await createOrFindProduct(stdGigPostProd);

    // => create or find plan on paypal service
    const planInput = {
      prodId: prodRes.product.id,
      codename: 'daily-test-plan',
      description: 'Daily test plan for testing purpose',
      totalCycles: 12,
      intervalUnit: 'DAY',
      intervalCount: 1,
      charge: 1.99,
    };
    const planRes = await createOrFindPlan(planInput, false);

    const localInputPlan = {
      codename: planInput.codename,
      serviceId: planRes.plan.id,
      status: 'ACTIVE',
      cyclePrice: planInput.charge,
      description: 'Daily plan for testing only',
    };
    const localPlan = await localCreateOrFindPlan(localInputPlan);

    _printResult('Daily Test plan', prodRes, planRes, localPlan);
  } catch (e) {
    console.error('Error on inserting plan(s)\n', e);
    process.exit(1);
  }
}

function _printResult(type, prod, plan, lplan) {
  console.log('\n>>> Seed on', type);
  if (prod.isDuplicate) {
    console.log(`=> Service Product: '${prod.product.name}' already exist`);
    console.log(prod.product);
  } else {
    console.log('=> Inserted product on paypal service: \n', prod.product);
  }
  if (plan.isDuplicate) {
    console.log(`=> Service Plan: '${plan.plan.name}' already exist`);
    console.log(plan.plan);
  } else {
    console.log('=> Inserted plan on paypal service: \n', plan.plan);
  }
  if (lplan.isDuplicate) {
    console.log(`=> Local Plan: '${lplan.plan.codename}' already exist`);
    console.log(lplan.plan);
  } else {
    console.log('=> Inserted plan on local service: \n', lplan.plan);
  }

  console.log('=> Result: SUCESSFUL');
}
