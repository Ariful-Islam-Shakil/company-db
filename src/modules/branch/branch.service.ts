import { docClient, TABLE_NAME } from "../../core/dynamo";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";
import { Company } from "../company/company.type";
import { Branch } from "./branch.type";
import { CreateBranchInput, UpdateBranchInput } from "./branch.input";

export class BranchService {
    // Create new branch under existing company and region
    async addBranch(companyId: string, regionId: string, input: CreateBranchInput): Promise<Branch> {
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

    // Update branch information
    async updateBranch(companyId: string, regionId: string, branchId: string, input: UpdateBranchInput): Promise<Branch> {
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

    // Delete any branch
    async deleteBranch(companyId: string, regionId: string, branchId: string): Promise<boolean> {
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
