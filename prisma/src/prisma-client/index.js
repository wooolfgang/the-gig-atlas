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
    name: "OnboardingStep",
    embedded: false
  },
  {
    name: "UserRole",
    embedded: false
  },
  {
    name: "AccountType",
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
    name: "Freelancer",
    embedded: false
  },
  {
    name: "PortfolioProject",
    embedded: false
  },
  {
    name: "Social",
    embedded: false
  },
  {
    name: "SocialType",
    embedded: false
  },
  {
    name: "GigCommunicationType",
    embedded: false
  },
  {
    name: "GigStatus",
    embedded: false
  },
  {
    name: "Gig",
    embedded: false
  },
  {
    name: "GigSource",
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
  },
  {
    name: "File",
    embedded: false
  },
  {
    name: "Product",
    embedded: false
  },
  {
    name: "PaymentService",
    embedded: false
  },
  {
    name: "PaymentStatus",
    embedded: false
  },
  {
    name: "Order",
    embedded: false
  },
  {
    name: "PlanStatus",
    embedded: false
  },
  {
    name: "Plan",
    embedded: false
  },
  {
    name: "SubscriptionStatus",
    embedded: false
  },
  {
    name: "PlanSubscription",
    embedded: false
  },
  {
    name: "Thread",
    embedded: false
  },
  {
    name: "Comment",
    embedded: false
  },
  {
    name: "ThreadVote",
    embedded: false
  },
  {
    name: "CommentVote",
    embedded: false
  },
  {
    name: "Tag",
    embedded: false
  },
  {
    name: "TagCategory",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_ENDPOINT"]}`,
  secret: `${process.env["SECRET_PRISMA"]}`
});
exports.prisma = new exports.Prisma();
