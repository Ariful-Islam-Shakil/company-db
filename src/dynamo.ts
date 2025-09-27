// src/dynamo.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
export const TABLE_NAME = "CompanyInfo";
// export const endpoint = "http://localhost:8000";
const endpoint = process.env.DYNAMODB_ENDPOINT

export const client = new DynamoDBClient({
  region: "local",
  endpoint,
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake"
  }
});

export const docClient = DynamoDBDocumentClient.from(client);
