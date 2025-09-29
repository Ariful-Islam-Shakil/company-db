import { CompanyModel } from '../../core/dynamo';
import { CreateCompanyInput } from './company.input';

export class CompanyService {
  async createCompany(input: CreateCompanyInput) {
    return await CompanyModel.create(input);
  }

  // Get company By companyID
  async getCompany(id: string) {
    return await CompanyModel.get({ id });
  }

  // Get company By company Name
  async getCompanyByName(name: string) {
    // return await CompanyModel.find({ name }, { index: "gs1" }); // Assuming GSI exists for name
    return await CompanyModel.find({name})
  }

  // Get all companies
  async listCompanies() {
    // return await CompanyModel.find({ gs1pk: "COMPANY" }, { index: "gs1" });
    return await CompanyModel.scan({});
  }

  // Update specific company
  async updateCompany(id: string, name: string) {
    return await CompanyModel.update({ id, name });
  }

  // delete company by ID
  async deleteCompany(id: string) {
    return await CompanyModel.remove({ id });
  }
}
