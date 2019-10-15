import paypal from '../../../serverless/paypal';

function isProductsValid(ids, products) {
  return ids.every(id => products.some(product => product.id === id));
}

async function order(_, { ids }, { prisma, user }) {
  // return paypal.createOrder(dummyItems, payor);
  const [products, buyer] = await Promise.all([
    prisma.products({ where: { id_in: ids } }),
    prisma.user(user.id),
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

  const { id: systemId } = await prisma.createOrder(createOrder);
  const orderId = {
    system: systemId,
    service: paypalOrderId,
  };

  return orderId;
}

export default {
  Query: {
    paypalCDN: () => paypal.getCDN(),
  },
  Mutation: {
    order,
  },
};
