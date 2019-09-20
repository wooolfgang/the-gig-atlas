export default {
  Query: {
    Freelancer: (_parent, args, ctx) => ctx.prisma.user(args),
    freelancers: (_parent, args, ctx) => ctx.prisma.freelancers(args),
    searchFreelancers: (_parent, { name }, ctx) =>
      ctx.prisma.freelancers({ where: { name_contains: name } }),
  },
};
