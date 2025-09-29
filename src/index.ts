// src/index.ts
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";

import { initTable } from "./core/dynamo";
import { CompanyResolver, RegionResolver, BranchResolver } from "./modules/company/companyResolver";

async function main() {
  // 1️⃣ Ensure DynamoDB Local table exists
  await initTable( false);

  // 2️⃣ Build GraphQL schema
  const schema = await buildSchema({
    resolvers: [CompanyResolver, RegionResolver, BranchResolver],
    validate: true,
  });

  // 3️⃣ Setup GraphQL Yoga
  const yoga = createYoga({
    schema,
    graphiql: true,
  });

  // 4️⃣ Start HTTP server
  const server = createServer(yoga);
  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`🚀 GraphQL server running at http://localhost:${port}/graphql`);
  });
}

// Run app
main().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
