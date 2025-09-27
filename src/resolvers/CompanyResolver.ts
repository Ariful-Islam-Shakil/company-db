// src/resolvers/CompanyResolver.ts
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Company } from "../entity/Company";
import { Branch } from "../entity/Branch";
import { Location } from "../entity/Location";
import {
  CreateCompanyInput,
  CreateBranchInput,
  CreateLocationInput,
  UpdateCompanyInput,
  UpdateBranchInput,
  UpdateLocationInput
} from "../entity/inputs";
import { docClient, TABLE_NAME } from "../dynamo";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

@Resolver(() => Company)
export class CompanyResolver {
  // list all companies
  @Query(() => [Company])
  async listCompanies(): Promise<Company[]> {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return (res.Items || []) as Company[];
  }

  // get single company
  @Query(() => Company)
  async getCompany(@Arg("id") id: string): Promise<Company> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!res.Item) throw new Error("Company not found");
    return res.Item as Company;
  }

  // create company (branches & locations optional)
  @Mutation(() => Company)
  async createCompany(@Arg("input") input: CreateCompanyInput): Promise<Company> {
    const companyId = uuidv4();
    const branches: Branch[] = (input.branches || []).map(b => {
      const branchId = uuidv4();
      const locations: Location[] = (b.locations || []).map(l => ({
        id: uuidv4(),
        name: l.name,
        address: l.address
      }));
      return { id: branchId, region: b.region, locations };
    });

    const item: Company = {
      id: companyId,
      name: input.name,
      branches,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return item;
  }

  // update top-level company fields (simple)
  @Mutation(() => Company)
  async updateCompany(@Arg("id") id: string, @Arg("input") input: UpdateCompanyInput): Promise<Company> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!res.Item) throw new Error("Company not found");
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

  // add branch
  @Mutation(() => Branch)
  async addBranch(@Arg("companyId") companyId: string, @Arg("input") input: CreateBranchInput): Promise<Branch> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new Error("Company not found");
    const company = res.Item as Company;

    const branchId = uuidv4();
    const locations: Location[] = (input.locations || []).map(l => ({
      id: uuidv4(),
      name: l.name,
      address: l.address
    }));

    const branch: Branch = { id: branchId, region: input.region, locations };
    company.branches = company.branches || [];
    company.branches.push(branch);

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return branch;
  }

  // update branch (read-modify-write)
  @Mutation(() => Branch)
  async updateBranch(@Arg("companyId") companyId: string, @Arg("branchId") branchId: string, @Arg("input") input: UpdateBranchInput): Promise<Branch> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new Error("Company not found");
    const company = res.Item as Company;

    const branch = (company.branches || []).find(b => b.id === branchId);
    if (!branch) throw new Error("Branch not found");

    if (input.region !== undefined) branch.region = input.region;

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return branch;
  }

  // delete branch
  @Mutation(() => Boolean)
  async deleteBranch(@Arg("companyId") companyId: string, @Arg("branchId") branchId: string): Promise<boolean> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new Error("Company not found");
    const company = res.Item as Company;

    company.branches = (company.branches || []).filter(b => b.id !== branchId);
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return true;
  }

  // add location into a branch
  @Mutation(() => Location)
  async addLocation(@Arg("companyId") companyId: string, @Arg("branchId") branchId: string, @Arg("input") input: CreateLocationInput): Promise<Location> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new Error("Company not found");
    const company = res.Item as Company;

    const branch = (company.branches || []).find(b => b.id === branchId);
    if (!branch) throw new Error("Branch not found");

    const loc: Location = { id: uuidv4(), name: input.name, address: input.address };
    branch.locations = branch.locations || [];
    branch.locations.push(loc);

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return loc;
  }

  // update location
  @Mutation(() => Location)
  async updateLocation(@Arg("companyId") companyId: string, @Arg("branchId") branchId: string, @Arg("locationId") locationId: string, @Arg("input") input: UpdateLocationInput): Promise<Location> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new Error("Company not found");
    const company = res.Item as Company;

    const branch = (company.branches || []).find(b => b.id === branchId);
    if (!branch) throw new Error("Branch not found");

    const loc = (branch.locations || []).find(l => l.id === locationId);
    if (!loc) throw new Error("Location not found");

    if (input.name !== undefined) loc.name = input.name;
    if (input.address !== undefined) loc.address = input.address;

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return loc;
  }

  // delete location
  @Mutation(() => Boolean)
  async deleteLocation(@Arg("companyId") companyId: string, @Arg("branchId") branchId: string, @Arg("locationId") locationId: string): Promise<boolean> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new Error("Company not found");
    const company = res.Item as Company;

    const branch = (company.branches || []).find(b => b.id === branchId);
    if (!branch) throw new Error("Branch not found");

    branch.locations = (branch.locations || []).filter(l => l.id !== locationId);
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return true;
  }
}
