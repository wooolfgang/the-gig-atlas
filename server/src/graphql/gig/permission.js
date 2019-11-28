import { allow, chain } from 'graphql-shield';
import common from '@shared/common';
import { validate, dompurify } from '../utils/rules';

export default {
  Mutation: {
    createGig: chain(
      dompurify(['gig.description', 'employer.introduction']),
      validate(common.validation.createGigInput),
    ),
    deleteGig: allow,
  },
  Query: {
    gigsListLanding: allow,
    searchGigs: allow,
  },
  Gig: allow,
};
