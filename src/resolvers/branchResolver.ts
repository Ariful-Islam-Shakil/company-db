import { Resolver, Mutation, Arg } from "type-graphql";
import { Company } from "../entity/Company";
import { Region } from "../entity/Region";
import { Branch } from "../entity/Branch";
import { CreateBranchInput, UpdateBranchInput } from "../entity/inputs";
import { docClient, TABLE_NAME } from "../dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";

@Resolver(() => Branch)
export class BranchResolver {
  // add branch
  @Mutation(() => Branch)
  async addBranch(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("input") input: CreateBranchInput
  ): Promise<Branch> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    const company = res.Item as Company;

    const region = (company.regions || []).find(r => r.id === regionId);
    if (!region) throw new GraphQLError("Region not found");

    const branch: Branch = { id: uuidv4(), branch_name: input.branch_name, address: input.address };
    region.branches = region.branches || [];
    region.branches.push(branch);

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return branch;
  }

  // update branch
  @Mutation(() => Branch)
  async updateBranch(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("branchId") branchId: string,
    @Arg("input") input: UpdateBranchInput
  ): Promise<Branch> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    const company = res.Item as Company;

    const region = (company.regions || []).find(r => r.id === regionId);
    if (!region) throw new GraphQLError("Region not found");

    const branch = (region.branches || []).find(b => b.id === branchId);
    if (!branch) throw new GraphQLError("Branch not found");

    if (input.branch_name !== undefined) branch.branch_name = input.branch_name;
    if (input.address !== undefined) branch.address = input.address;

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return branch;
  }

  // delete branch
  @Mutation(() => Boolean)
  async deleteBranch(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("branchId") branchId: string
  ): Promise<boolean> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    const company = res.Item as Company;

    const region = (company.regions || []).find(r => r.id === regionId);
    if (!region) throw new GraphQLError("Region not found");

    region.branches = (region.branches || []).filter(b => b.id !== branchId);

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return true;
  }
}
