import { Company } from "../company/company.type";
import { Region } from "./region.type";
import { Branch } from "../branch/branch.type";
import { CreateRegionInput, UpdateRegionInput } from "./region.input";
import { docClient, TABLE_NAME } from "../../core/dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";

export class RegionService {

    // Add new Region to existing company, Optionaly can include branches
    async addRegion(companyId: string, input: CreateRegionInput): Promise<Region> {
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

    // Update Region Information
    async updateRegion(companyId: string, regionId: string, input: UpdateRegionInput): Promise<Region> {
        const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
        if (!res.Item) throw new GraphQLError("Company not found");
        const company = res.Item as Company;

        const region = (company.regions || []).find(r => r.id === regionId);
        if (!region) throw new GraphQLError("Region not found");

        if (input.region_name !== undefined) region.region_name = input.region_name;

        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
        return region;
    }

    // Delete any region by RegionID
    async deleteRegion(companyId: string, regionId: string): Promise<boolean> {
        const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: companyId } }));
        if (!res.Item) throw new GraphQLError("Company not found");
        const company = res.Item as Company;

        company.regions = (company.regions || []).filter(r => r.id !== regionId);
        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
        return true;
    }
}
