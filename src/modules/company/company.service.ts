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
    return await CompanyModel.create(input);
  }

  // Get company By company Name
  async getCompanyByName(name: string) {
    name = name.trim();
    return await CompanyModel.find({name});
  }

  // Update specific company
  async updateCompany(id: string, name: string) {
    name = name.trim();
    return await CompanyModel.update({ id, name });
  }
  // delete company by ID
  async deleteCompany(id: string) {
    return await CompanyModel.remove({ id });
  }
}