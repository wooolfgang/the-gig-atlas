"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "UserRole",
    embedded: false
  },
  {
    name: "Employer",
    embedded: false
  },
  {
    name: "EmployerType",
    embedded: false
  },
  {
    name: "Gig",
    embedded: false
  },
  {
    name: "JobType",
    embedded: false
  },
  {
    name: "PaymentType",
    embedded: false
  },
  {
    name: "ProjectType",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`,
  secret: `${process.env["SECRET_PRISMA"]}`
});
exports.prisma = new exports.Prisma();
