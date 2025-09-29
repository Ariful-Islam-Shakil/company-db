// src/index.ts
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { initTable } from "./core/dynamo";
import { CompanyResolver } from "./modules/company/companyResolver";
import { RegionResolver } from "./modules/region/regionResolver"
import { BranchResolver } from "./modules/branch/branchResolver"

async function main() {
  // 1️. Ensure DynamoDB Local table exists. Pass true for deleting existing table
  await initTable( false);

  // 2️. Build GraphQL schema
  const schema = await buildSchema({
    resolvers: [CompanyResolver, RegionResolver, BranchResolver],
    validate: true,
  });

  // 3️. Setup GraphQL Yoga
  const yoga = createYoga({
    schema,
    graphiql: true,
  });

  // 4️. Start HTTP server
  const server = createServer(yoga);
  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  });
}

// Run app
main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
