import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Table } from "dynamodb-onetable";

const isProd = process.env.NODE_ENV === "production";

const client = new DynamoDBClient(
  isProd
    ? { region: process.env.AWS_REGION } // AWS Lambda: region auto-set
    : {
        region: "local",
        endpoint: process.env.DYNAMO_ENDPOINT || "http://localhost:8000",
        credentials: {
          accessKeyId: "fakeMyKeyId",
          secretAccessKey: "fakeSecret",
        },
      }
);

const schema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
    gs1: { hash: "gs1pk", sort: "id" },
  },
  models: {
    Company: {
      pk: { type: String, value: "COMPANY" },
      sk: { type: String, value: "COMPANY#${id}" },
      id: { type: String, generate: "uuid" },
      name: { type: String, required: true },
      gs1pk: { type: String, value: "COMPANY" },
    },
    Region: {
      pk: { type: String, value: "COMPANY#${companyId}" },
      sk: { type: String, value: "REGION#${id}" },
      id: { type: String, generate: "uuid" },
      companyId: { type: String, required: true },
      region_name: { type: String, required: true },
      gs1pk: { type: String, value: "REGION" },
    },
    Branch: {
      pk: { type: String, value: "REGION#${regionId}" },
      sk: { type: String, value: "BRANCH#${id}" },
      id: { type: String, generate: "uuid" },
      regionId: { type: String, required: true },
      branch_name: { type: String, required: true },
      address: { type: String },
      gs1pk: { type: String, value: "BRANCH" },
    },
  },
};

export const table = new Table({
  client,
  name: process.env.TABLE_NAME || "CompanyDB",
  schema,
});

export const CompanyModel = table.getModel("Company");
export const RegionModel = table.getModel("Region");
export const BranchModel = table.getModel("Branch");

export async function initTable(deleteFirst = false) {
  if (!isProd) {
    const exists = await table.exists();

    if (exists && deleteFirst) {
      console.log("Table exists. Deleting...");
      await table.deleteTable("DeleteTableForever");
      console.log("Table CompanyDB deleted!");
    }

    if (!exists || deleteFirst) {
      console.log("Creating table...");
      await table.createTable();
      console.log("Table CompanyDB created!");
    } else {
      console.log("Table CompanyDB already exists.");
    }
  }
}
