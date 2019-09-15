export default {
  Query: {
    employers: (_parent, _args, ctx) => ctx.prisma.employers(),
    searchEmployers: (_parent, { name }, ctx) =>
      ctx.prisma.employers({ where: { name_contains: name } }),
  },
};
