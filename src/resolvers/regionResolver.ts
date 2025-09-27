import { Resolver, Mutation, Arg } from "type-graphql";
import { Company } from "../entity/Company";
import { Region } from "../entity/Region";
import { Branch } from "../entity/Branch";
import { CreateRegionInput, UpdateRegionInput } from "../entity/inputs";
import { docClient, TABLE_NAME } from "../dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";

@Resolver(() => Region)
export class RegionResolver {
  // add region
  @Mutation(() => Region)
  async addRegion(@Arg("companyId") companyId: string, @Arg("input") input: CreateRegionInput): Promise<Region> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    const company = res.Item as Company;

    const regionId = uuidv4();
    const branches: Branch[] = (input.branches || []).map(b => ({
      id: uuidv4(),
      branch_name: b.branch_name,
      address: b.address,
    }));

    const region: Region = { id: regionId, region_name: input.region_name, branches };
    company.regions = company.regions || [];
    company.regions.push(region);

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return region;
  }

  // update region
  @Mutation(() => Region)
  async updateRegion(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("input") input: UpdateRegionInput
  ): Promise<Region> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    const company = res.Item as Company;

    const region = (company.regions || []).find(r => r.id === regionId);
    if (!region) throw new GraphQLError("Region not found");

    if (input.region_name !== undefined) region.region_name = input.region_name;

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return region;
  }

  // delete region
  @Mutation(() => Boolean)
  async deleteRegion(@Arg("companyId") companyId: string, @Arg("regionId") regionId: string): Promise<boolean> {
    const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
    if (!res.Item) throw new GraphQLError("Company not found");
    const company = res.Item as Company;

    company.regions = (company.regions || []).filter(r => r.id !== regionId);
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
    return true;
  }
}
