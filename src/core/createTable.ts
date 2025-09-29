import { table } from "./dynamo";

async function main() {
  try {
    await table.createTable();
    console.log("✅ Table created successfully");
  } catch (err: any) {
    if (err.code === "ResourceInUseException") {
      console.log("⚠️ Table already exists");
    } else {
      console.error(err);
    }
  }
}

main();
