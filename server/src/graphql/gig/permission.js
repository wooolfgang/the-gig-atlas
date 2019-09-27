import { allow } from 'graphql-shield';

export default {
  Mutation: {
    newGig: allow,
    deleteGig: allow,
  },
  Gig: allow,
};
