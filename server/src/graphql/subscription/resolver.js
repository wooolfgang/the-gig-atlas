import prisma from '@thegigatlas/prisma';
import paypalSubscription from '../../serverless/paypal/subscription';

function queryPlan(_, { id }) {
  return prisma.plan({ id });
}

function queryListPlans(_, { paging = {} }) {
  return prisma.plans(paging);
}

function queryAllActivePlans() {
  return prisma.plans({ where: { status: 'ACTIVE' } });
}

function querySubscription(_r, { id }) {
  return prisma.planSubscription({ id });
}

function queryListSubscription(_r, { paging = {} }) {
  return prisma.planSubscription(paging);
}

/**
 * Subscribe gig after creation
 * @todo connect to gig
 */
async function subscribe(_r, { planCode, gigId }, { user }) {
  const plan = await prisma.plan({ codename: planCode });
  if (!plan) {
    throw new Error(`Plan '${planCode}' not found.`);
  } else if (plan.status !== 'ACTIVE') {
    throw new Error('Invalid plan status');
  }

  const { id } = await paypalSubscription.createSubscription(plan.serviceId);
  await prisma.createPlanSubscription({
    subscriber: { connect: { id: user.id } },
    serviceId: id,
    service: 'PAYPAL',
    status: 'CREATED',
    plan: { connect: { id: plan.id } },
    endAt: new Date(),
    gig: { connect: { id: gigId } },
  });

  return { id, status: 'CREATED' };
}

export async function approveSubscription(_r, { serviceId }) {
  const serviceSub = await paypalSubscription.showSubscription(serviceId);
  if (!serviceSub) {
    // => check if subscription is valid from service provider
    throw new Error('Invalid subscription to approve');
  } else if (serviceSub.status !== 'ACTIVE') {
    throw new Error('Subscription already active from service provider');
  }

  // => update subscription and get gig id
  const gigId = await prisma
    // eslint-disable-next-line prettier/prettier
    .updatePlanSubscription({ where: { serviceId }, data: { status: 'ACTIVE' } })
    .gig()
    .id();
  // => update gig status
  await prisma.updateGig({ where: { id: gigId }, data: { status: 'POSTED' } });

  return gigId;
}

export default {
  Query: {
    plan: queryPlan,
    listPlans: queryListPlans,
    activePlans: queryAllActivePlans,
    subscription: querySubscription,
    listSubscriptions: queryListSubscription,
  },
  Mutation: {
    subscribe,
    approveSubscription,
  },
};
