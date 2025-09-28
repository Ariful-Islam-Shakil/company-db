import { docClient, TABLE_NAME } from "../../core/dynamo";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { GraphQLError } from "graphql";
import { Company } from "./company.type";
import { Region } from "../region/region.type";
import { Branch } from "../branch/branch.type";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.input";

export class CompanyService {

    // List all companies
    async listCompanies(): Promise<Company[]> {
        const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
        return (res.Items || []) as Company[];
    }
    
    // Find compani by ID
    async getCompany(id: string): Promise<Company> {
        const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
        if (!res.Item) throw new GraphQLError("Company not found");
        return res.Item as Company;
    }

    // Get Company By Company Name
    async getCompanyByName(companyName: string): Promise<Company> {
        // Fetch all companies from DynamoDB
        const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));

        if (!res.Items || res.Items.length === 0) {
            throw new GraphQLError(`Failed to fetch data from ${TABLE_NAME} table`);
        }

        // Filter by company name
        const company = (res.Items as Company[]).find(c => c.name === companyName);

        if (!company) {
            throw new GraphQLError(`Company with name "${companyName}" not found`);
        }

        return company;
    }

    // Find companies on specific region
    async companiesByRegion(region_name: string): Promise<Company[]> {
        const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
        if (!res.Items || res.Items.length === 0) {
        throw new GraphQLError(`Failed to fetch data from ${TABLE_NAME} table`);
        }

        return (res.Items as Company[]).filter(company =>
        (company.regions || []).some(region => region.region_name.toLowerCase() === region_name.toLowerCase())
        );
    }

    // Create a new company, Region and Branch are optional
    async createCompany(input: CreateCompanyInput): Promise<Company> {
        // Fetch all companies from DynamoDB
        const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));

        if (!res.Items) {
            throw new GraphQLError(`Failed to fetch data from ${TABLE_NAME} table`);
        }

        // Check if a company with the same name already exists
        const existingCompany = (res.Items as Company[]).find(c => c.name.toLowerCase() === input.name.toLowerCase());
        if (existingCompany) {
            throw new GraphQLError(`Company with name "${input.name}" already exists. You cadd branches to this company`);
        }

        // Create regions and branches
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

    // Update company name By CompanyID
    async updateCompany(id: string, input: UpdateCompanyInput): Promise<Company> {
        const res = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
        if (!res.Item) throw new GraphQLError("Company not found");
        const company = res.Item as Company;

        if (input.name !== undefined) company.name = input.name;

        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: company }));
        return company;
    }

    // Delete company By CompanyID
    async deleteCompany(id: string): Promise<boolean> {
        await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
        return true;
    }
}
