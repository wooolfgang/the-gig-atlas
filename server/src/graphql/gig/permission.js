import { allow } from 'graphql-shield';
import common from '@shared/common';
import { validate } from '../utils/rules';

export default {
  Mutation: {
    createGig: validate(common.validation.createGigInput),
    deleteGig: allow,
  },
  Gig: allow,
};
