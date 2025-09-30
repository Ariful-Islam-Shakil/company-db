import { GraphQLError } from "graphql";
import { CompanyModel } from "../../core/dynamo";
import {CreateCompanyInput} from "./company.input"

function encodeCursor(obj: any): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

function decodeCursor(cursor: string): any {
  return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
}

// All company services
export class CompanyService{
  // Pagination of company list
  async listCompaniesPaginated(first = 10, after?: string) {
    const nextKey = after ? decodeCursor(after) : undefined;

    const result = await CompanyModel.find(
      {  },
      { limit: first, next: nextKey }
    );

    const edges = result.map((item: any) => ({
      node: item,
      cursor: encodeCursor({ pk: item.pk, sk: item.sk }),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: !!result.next,
        endCursor: result.next ? encodeCursor(result.next) : null,
      },
      totalCount: undefined,
    };
  }
  // Create new company
  async createCompany(input: CreateCompanyInput) {
    try {
      if (!input?.name?.trim()) {
        throw new GraphQLError("Company name is required.");
      }
      input.name = input.name.trim();
      const company = await CompanyModel.create(input);
      if (!company) {
        throw new GraphQLError("Failed to create company.");
      }
      return company;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error creating company.");
    }
  }

  // Get company by company Name
  async getCompanyByName(name: string) {
    try {
      name = name?.trim();
      if (!name) {
        throw new GraphQLError("Company name is required.");
      }

      const companies = await CompanyModel.find({ name });
      if (!companies || companies.length === 0) {
        throw new GraphQLError(`No company found with name: ${name}`);
      }
      return companies;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error fetching company by name.");
    }
  }

  // Update specific company
  async updateCompany(id: string, name: string) {
    try {
      if (!id) {
        throw new GraphQLError("Company ID is required.");
      }

      name = name?.trim();
      if (!name) {
        throw new GraphQLError("Company name is required.");
      }

      const updated = await CompanyModel.update({ id, name });
      if (!updated) {
        throw new GraphQLError(`No company found with id: ${id}`);
      }
      return updated;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error updating company.");
    }
  }

  // Delete company by ID
  async deleteCompany(id: string) {
    try {
      if (!id) {
        throw new GraphQLError("Company ID is required.");
      }
      const deleted = await CompanyModel.remove({ id });
      if (!deleted) {
        throw new GraphQLError(`No company found with id: ${id}`);
      }
      return deleted;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error deleting company.");
    }
  }
}