import subsapi from '../../serverless/paypal/subscription';

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
  const plan = await prisma.plan({ codename: planCode });
  if (!plan) {
    throw new Error(`Plan '${planCode}' not found.`);
  } else if (plan.status !== 'ACTIVE') {
    throw new Error('Invalid plan status');
  }

  const { id } = await subsapi.createSubscription(plan.serviceId);
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
  const serviceSub = await subsapi.showSubscription(serviceId);
  if (!serviceSub || serviceSub.status !== 'ACTIVE') {
    throw new Error('Invalid subscription to approve');
  }

  await prisma.updatePlanSubscription({
    where: { serviceId },
    data: { status: 'ACTIVE' },
  });

  return true;
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
