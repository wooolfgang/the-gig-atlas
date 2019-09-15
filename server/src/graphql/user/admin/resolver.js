export default {
  Query: {
    admins: (_parent, args, ctx) => ctx.prisma.admins(args),
  },
};
