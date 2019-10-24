/* eslint-disable no-console */
// import { prisma } from '../../src/generated/prisma-client';
import paypal from '../../src/serverless/paypal';
import { createOrFindPlan as localCreateOrFindPlan } from '../../src/graphql/subscription/plan';

const {
  product: { createOrFindProduct },
  plan: { createOrFindPlan },
} = paypal;

export default async () => {
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

    console.log('\n>>> Seed on plan');
    if (prodRes.isDuplicate) {
      console.log(`Service Product: '${prodRes.product.name}' already exist`);
    } else {
      console.log('Inserted product on paypal service: \n', prodRes.product);
    }
    if (planRes.isDuplicate) {
      console.log(`Service Plan: '${planRes.plan.name}' already exist`);
    } else {
      console.log('Inserted plan on paypal service: \n', planRes.plan);
    }
    if (localPlan.isDuplicate) {
      console.log(`Local Plan: '${localPlan.plan.codename}' already exist`);
    } else {
      console.log('Inserted plan on local service: \n', localPlan.plan);
    }
  } catch (e) {
    console.error('Error on inserting plan(s)\n', e);
    process.exit(1);
  }
};
