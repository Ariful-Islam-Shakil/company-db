// src/createTable.ts
import { DynamoDBClient, CreateTableCommand, ScalarAttributeType, KeyType, BillingMode } from "@aws-sdk/client-dynamodb";

const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const client = new DynamoDBClient({
  region: "local",
  endpoint,
  credentials: { accessKeyId: "fake", secretAccessKey: "fake" }
});

async function main() {
  const params = {
    TableName: "Companies",
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: ScalarAttributeType.S }],
    KeySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }],
    BillingMode: BillingMode.PAY_PER_REQUEST
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log("Companies table created");
  } catch (err: any) {
    if (err.name === "ResourceInUseException") {
      console.log("Table already exists");
    } else {
      console.error("Create table error:", err);
      process.exit(1);
    }
  }
}

main();
