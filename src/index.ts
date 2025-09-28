// src/index.ts
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { CompanyResolver } from "./modules/company/companyResolver";
import { RegionResolver } from "./modules/region/regionResolver";
import { BranchResolver } from "./modules/branch/branchResolver";

async function main() {
  const schema = await buildSchema({ resolvers: [CompanyResolver, RegionResolver, BranchResolver], validate: true });
  const yoga = createYoga({ schema, graphiql: true });
  const server = createServer(yoga);
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
