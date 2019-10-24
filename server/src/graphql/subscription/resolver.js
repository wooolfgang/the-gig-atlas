
function queryPlan(_, { id }, { prisma }) {
  return prisma.plan({ id });
}

function queryListPlans(_, { paging = {} }, { prisma }) {
  return prisma.plans(paging);
}

function querySubscription(_, { id }, { prisma }) {
  return prisma.planSubscription({ id });
}

function queryListSubscription(_, { paging = {} }, { prisma }) {
  return prisma.planSubscription(paging);
}

async function subscribe(_, {}, { prisma }) {
  
}

export default {
  Query: {
    plan: queryPlan,
    listPlans: queryListPlans,
    subscription: querySubscription,
    listSubscription: queryListSubscription,
  },
  Mutation: {
    subscribe: 
  },
};
