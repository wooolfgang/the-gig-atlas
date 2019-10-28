/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import axios from 'axios';
import config from '../../config';
import prisma from '../../prisma';
import paypal from '../../serverless/paypal';
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
  await _catchError(prisma.createUser(subscriber), 'error on user create')
    .then(user => createAuth(user.id, user.role))
    .then(auth => {
      console.log('user:', auth );
      token = auth.token;
    });
  await _catchError(
    prisma.createPlan(localInputPlan),
    'Error on local plan create',
  );
});

let subscriptionId;

afterAll(async () => {
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

/**
 * @todo: beforeAll takes too long that it fails the test
 * @problem jest bug
 */
describe.skip('Subscription', () => {
  it('creates new subscription', async () => {
    const aconfig = { headers: { Authorization: `Bearer ${token}` } };
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
      throw new Error('Unknown error');
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

// [more testing simulation] => https://developer.paypal.com/docs/subscriptions/testing/
