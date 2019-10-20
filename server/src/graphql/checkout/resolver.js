import paypal from '../../serverless/paypal/order';

function isProductsValid(ids, products) {
  return ids.every(id => products.some(product => product.id === id));
}

async function order(_, { items: ids }, { prisma, user }) {
  const [products, buyer] = await Promise.all([
    prisma.products({ where: { id_in: ids } }),
    prisma.user({ id: user.id }),
  ]);

  if (!isProductsValid(ids, products)) {
    throw new Error('Invalid Input product(s)');
  }

  const payor = {
    name: {
      given_name: buyer.firstName,
      surname: buyer.lastName,
    },
    email: buyer.email,
  };
  const items = products.map(({ name, price, description }) => ({
    name,
    price,
    description,
    quantity: 1,
  }));

  const [paypalOrderId, totalPrice] = await paypal.createOrder(items, payor);
  const createOrder = {
    serviceRefId: paypalOrderId,
    payer: { connect: { id: user.id } },
    service: 'PAYPAL',
    status: 'CREATED',
    cost: totalPrice,
  };

  await prisma.createOrder(createOrder);

  return paypalOrderId;
}
/**
 * @todo: integrate with gig
 * Handles order after user approved the payment
 * @param {String} orderId if of user approved order
 */
async function completeOrder(_, { orderId }, { prisma }) {
  const completedOrder = await paypal.capturePayment(orderId);
  const completedSys = await prisma.updateOrder({
    where: { serviceRefId: orderId },
    data: {
      status: 'COMPLETED',
    },
  });

  return true;
}

export default {
  Query: {
    paypalCDN: () => paypal.getCDN(),
  },
  Mutation: {
    order,
    completeOrder,
  },
};
