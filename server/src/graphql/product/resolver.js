import prisma from '../../prisma';

/* eslint-disable arrow-body-style */
const product = (_, { id }) => {
  return prisma.product(id);
};

const products = () => prisma.products();

const addProduct = (_, { input }) => {
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
