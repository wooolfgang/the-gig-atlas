/* eslint-disable import/prefer-default-export */
import { prisma } from '../../generated/prisma-client';
/**
 * Create plan obj
 * @typedef {Object} CreatePlan
 * @property {string} codename - unique name reference
 * @property {string} serviceId - service reference id from service db
 * @property {string} status - [INACTIVE|ACTIVE] plan current status
 * @property {string} description - detail about plan
 */

/**
 * Returns plan if already exist or create new one
 * @param {CreatePlan} plan
 */
export async function createOrFindPlan(plan) {
  const current = await prisma.plan({ codename: plan.codename });

  if (current) {
    return {
      isDuplicate: true,
      plan: current,
    };
  }

  return prisma.createPlan(plan).then(p => ({ isDuplicate: false, plan: p }));
}
