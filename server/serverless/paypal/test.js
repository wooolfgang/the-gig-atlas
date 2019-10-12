// import axios from 'axios';
import { getToken, createOrder } from '.';

describe('Test Paypal Sandbox API', () => {
  it.skip('Handles Authorization from paypal', async () => {
    // console.log('here on test');
    const { token_type, app_id } = await getToken();

    expect(token_type).toBe('Bearer');
    expect(app_id).toBe('APP-80W284485P519543T');

    // expect(res).toBeInstanceOf(String);
  });

  it('Creates order (not to be paid) to paypal', async () => {
    const dummyItems = [
      {
        name: 'Gig Post',
        description: 'Post a gig',
        price: 55,
        quantity: 1,
      },
      {
        name: 'Blue Adjust',
        description: 'Blue animation',
        price: 10,
        quantity: 1,
      },
    ];
    const payor = {
      name: { given_name: 'Martin', surname: 'Doe' },
      email: 'martin@t5t.com',
    };
    const res = await createOrder(dummyItems, payor);
    console.log('response after order test');
    console.log(res);
  });
});
