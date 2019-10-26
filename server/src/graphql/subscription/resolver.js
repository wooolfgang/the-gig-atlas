import subscription from '../../serverless/paypal/subscription';

function queryPlan(_, { id }, { prisma }) {
  return prisma.plan({ id });
}

function queryListPlans(_, { paging = {} }, { prisma }) {
  return prisma.plans(paging);
}

function queryAllActivePlans(_, _a, { prisma }) {
  return prisma.plans({ where: { status: 'ACTIVE' } });
}

function querySubscription(_, { id }, { prisma }) {
  return prisma.planSubscription({ id });
}

function queryListSubscription(_, { paging = {} }, { prisma }) {
  return prisma.planSubscription(paging);
}

/**
 * Subscribe gig after creation
 * @todo connect to gig
 */
async function subscribe(_, { planCode }, { prisma, user }) {
  const [plan, subscriber] = await Promise.all([
    prisma.plan({ codename: planCode }),
    prisma.user({ id: user.id }),
  ]);
  if (!plan) {
    throw new Error(`Plan '${planCode}' not found.`);
  } else if (plan.status !== 'ACTIVE') {
    throw new Error('Invalid plan status');
  }

  const { id } = await subscription.createSubscription(
    plan.serviceId,
    subscriber,
  );
  await prisma.createPlanSubscription({
    subscriber: { connect: { id: user.id } },
    serviceId: id,
    service: 'PAYPAL',
    status: 'CREATED',
    plan: { connect: { id: plan.id } },
    endAt: new Date(),
  });

  return { id, status: 'CREATED' };
}

export async function approveSubscription(_, { serviceId }, { prisma }) {
  // unimplemented!
  return false;
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
