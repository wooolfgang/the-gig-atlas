/* eslint-disable no-console */
// import cfg from '../../src/config';
import { prisma } from '../../src/generated/prisma-client';

export default async () => {
  const products = {
    name: 'Blue Background',
    price: 24.99,
    description: 'Add attractive color blue background to your post',
    addonTo: {
      create: {
        name: 'Gig Post',
        price: 10.99,
        description: 'Post a gig for everyone to see',
      },
    },
  };

  try {
    const [deleted] = await Promise.all([
      prisma.deleteManyProducts(),
      prisma.createProduct(products),
    ]);

    const newProds = await prisma.products();

    console.log('\n>>> Seed on products');
    console.log('removed old products', deleted);
    console.log('created new products:\n', newProds);
  } catch (e) {
    console.error('error on inserting product(s)\n', e);
    process.exit(1);
  }
};
