import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createYoga } from "graphql-yoga";
import { CompanyResolver } from "./modules/company/companyResolver";
import { RegionResolver } from "./modules/region/regionResolver";
import { BranchResolver } from "./modules/branch/branchResolver";

let handler: any;

async function getHandler() {
  if (!handler) {
    const schema = await buildSchema({
      resolvers: [CompanyResolver, RegionResolver, BranchResolver],
      validate: true,
    });

    const yoga = createYoga({ schema });
    handler = yoga;
  }
  return handler;
}

export const main = async (event: any, context: any) => {
  const yoga = await getHandler();
  return yoga.handleNodeRequest(event, context);
};
