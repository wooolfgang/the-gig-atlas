import verifyAdmin from './auth/verifyAdmin';

export default {
  Mutation: {
    deleteAdmin: verifyAdmin,
  },
};
