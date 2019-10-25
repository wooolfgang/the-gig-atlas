/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@shared/common';
import config from '../../config';
import prisma from '../../prisma';
// import { prisma } from '../../generated/prisma-client';
import paypal from '../../serverless/paypal';
import { createOrFindPlan as localCreateOrFindPlan } from './plan';
import { createAuth } from '../auth/util';

const {
  product: { createOrFindProduct },
  plan: { createOrFindPlan },
} = paypal;

const subscriber = {
  email: 'subscriptiontester@gmail.com',
  password: 'asdsadsadas',
  role: 'MEMBER',
  firstName: 'test subscriber',
  lastName: 'testing only',
};
let token;

beforeAll(async () => {
  console.log('run here >>> 1.0');
  const testGigPost = {
    codename: 'test-gig-post',
    description: 'testing purpose only',
  };
  const prodRes = await _catchError(
    createOrFindProduct(testGigPost),
    'Error on product create',
  );
  const planInput = {
    prodId: prodRes.product.id,
    codename: 'test-plan',
    description: 'Test monthly charged plan',
    monthlyCharge: 29.99,
  };
  const planRes = await _catchError(
    createOrFindPlan(planInput),
    'Error on service plan create',
  );
  const localInputPlan = {
    codename: planInput.codename,
    serviceId: planRes.plan.id,
    status: 'ACTIVE',
    cyclePrice: planInput.monthlyCharge,
    description: 'Basic test plan for all gig post',
  };
  console.log('run here >>> 1.5');
  await _catchError(prisma.createUser(subscriber), 'error on user create')
    .then(user => createAuth(user.id, user.role))
    .then(auth => {
      token = auth.token;
    });
  await _catchError(
    prisma.createPlan(localInputPlan),
    'Error on local plan create',
  ).then(_ => console.log('run here: >>>> 1.8'));
  // console.log('created plan/user', user, createdPlan);
});

let subscriptionId;

afterAll(async () => {
  console.log('run here: >>>> 3');
  try {
    if (subscriptionId) {
      await prisma.deletePlanSubscription({ serviceId: subscriptionId });
    }

    await Promise.all([
      prisma.deletePlan({ codename: 'test-plan' }),
      prisma.deleteUser({ email: subscriber.email }),
    ]);
  } catch (e) {
    //
  }
});

describe('Subscription', () => {
  it('creates new subscription', async () => {
    const aconfig = { headers: { Authorization: `Bearer ${token}` } };
    console.log('run here: >>>> 2.0');
    const input = {
      query: `
        mutation {
          subscribe(planCode: "test-plan") {
            id
            status
          }
        }`,
    };

    const { subscribe } = await _post(input, aconfig);
    subscriptionId = subscribe.id;
    expect(subscribe.status).toBe('CREATED');
  });
});

function _catchError(promise, msg) {
  return promise.catch(e => {
    console.log('\n>>>>>>', msg);
    console.log(e);
    console.log('>>>>>');
  });
}

async function _post(input, aconfig) {
  const { testUrl } = config;

  try {
    const { data } = await axios.post(testUrl, input, aconfig);
    console.log(data);

    if (data.data.errors) {
      throw new Error('gql error');
    } else {
      return data.data;
    }
  } catch (e) {
    if (!e) {
      throw new Error('UNKNOW ERR');
    }

    if (e.toJSON) {
      console.log(e.toJSON());
    } else if (e.response) {
      e.response.request = null;
      console.log(e.response);
    } else {
      console.log(e);
    }

    throw new Error('err');
  }
}
