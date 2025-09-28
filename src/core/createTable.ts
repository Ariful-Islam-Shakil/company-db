// src/createTable.ts
import { CreateTableCommand, ScalarAttributeType, KeyType, BillingMode } from "@aws-sdk/client-dynamodb";
import { TABLE_NAME, client } from "./dynamo"; 

async function main() {
  const params = {
    TableName: TABLE_NAME,
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
