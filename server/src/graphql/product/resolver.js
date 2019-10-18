/* eslint-disable arrow-body-style */
const product = (_, { id }, { prisma }) => {
  return prisma.product(id);
};

const products = (_, _a, { prisma }) => {
  return prisma.products();
};

const addProduct = (_, { input }, { prisma }) => {
  const { name, description, addOnToId } = input;
  const create = { name, description };
  if (addOnToId) {
    create.addonTo = { connect: { id: addOnToId } };
  }

  return prisma.createProduct(create);
};

export default {
  Query: {
    products,
    product,
  },
  Mutation: {
    addProduct,
  },
};
