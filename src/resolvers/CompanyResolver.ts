import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Company } from "../entity/Company";
import { Region } from "../entity/Region";
import { Branch } from "../entity/Branch";
import { CreateCompanyInput, UpdateCompanyInput } from "../entity/inputs";
import { docClient, TABLE_NAME } from "../dynamo";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";

@Resolver(() => Company)
export class CompanyResolver {
  // list all companies
  @Query(() => [Company])
  async listCompanies(): Promise<Company[]> {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return (res.Items || []) as Company[];
  }

  // get single company by ID
  @Query(() => Company)
  async getCompany(@Arg("id") id: string): Promise<Company> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    return res.Item as Company;
  }

  // get company by name
  @Query(() => Company)
  async getCompanyByName(@Arg("companyName") companyName: string): Promise<Company> {
    const res = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#name = :name",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: { ":name": companyName },
        Limit: 1,
      })
    );
    if (!res.Items || res.Items.length === 0) {
      throw new GraphQLError(`Company with name "${companyName}" not found`);
    }
    return res.Items[0] as Company;
  }

  // Return all companies that have at least one region with the given region name
  @Query(() => [Company])
  async companiesByRegion(@Arg("region_name") region_name: string): Promise<Company[]> {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));

    if (!res.Items || res.Items.length === 0) {
      throw new GraphQLError(`Failed to fetch data from ${TABLE_NAME} table`);
    }

    return (res.Items as Company[]).filter(company =>
      (company.regions || []).some(region => region.region_name === region_name)
    );
  }

  // create company (with optional regions & branches)
  @Mutation(() => Company)
  async createCompany(@Arg("input") input: CreateCompanyInput): Promise<Company> {
    // check if company already exists
    const existing = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#name = :name",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: { ":name": input.name },
        Limit: 1,
      })
    );
    if (existing.Items && existing.Items.length > 0) {
      throw new GraphQLError(`Company with name "${input.name}" already exists`);
    }

    // create new record
    const companyId = uuidv4();
    const regions: Region[] = (input.regions || []).map(r => {
      const regionId = uuidv4();
      const branches: Branch[] = (r.branches || []).map(b => ({
        id: uuidv4(),
        branch_name: b.branch_name,
        address: b.address,
      }));
      return { id: regionId, region_name: r.region_name, branches };
    });

    const item: Company = {
      id: companyId,
      name: input.name,
      regions,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return item;
  }

  // update company name
  @Mutation(() => Company)
  async updateCompany(@Arg("id") id: string, @Arg("input") input: UpdateCompanyInput): Promise<Company> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    const company = res.Item as Company;

    if (input.name !== undefined) company.name = input.name;

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return company;
  }

  // delete company
  @Mutation(() => Boolean)
  async deleteCompany(@Arg("id") id: string): Promise<boolean> {
    await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
    return true;
  }
}
