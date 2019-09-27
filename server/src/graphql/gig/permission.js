import { allow, chain } from 'graphql-shield';
import common from '@shared/common';
import { validate, verifyUser, isAuthenticated } from '../utils/rules';

export default {
  Mutation: {
    newGig: chain(
      validate(common.validation.gigInput),
      verifyUser,
      isAuthenticated,
    ),
    deleteGig: allow,
  },
  Gig: allow,
};
