// src/dynamo.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const TABLE_NAME = process.env.COMPANIES_TABLE || "Companies";
const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";

const client = new DynamoDBClient({
  region: "local",
  endpoint,
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake"
  }
});

export const docClient = DynamoDBDocumentClient.from(client);
