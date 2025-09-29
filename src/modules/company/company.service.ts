import { CompanyModel, RegionModel, BranchModel } from '../../core/dynamo';
import { CreateCompanyInput, CreateRegionInput, CreateBranchInput, UpdateRegionInput, UpdateBranchInput } from './company.input';

export class CompanyService {
  async createCompany(input: CreateCompanyInput) {
    return await CompanyModel.create(input);
  }

  async getCompany(id: string) {
    return await CompanyModel.get({ id });
  }

  async getCompanyByName(name: string) {
    return await CompanyModel.find({ name }, { index: "gs1" }); // Assuming GSI exists for name
  }

  async listCompanies() {
    return await CompanyModel.find({ gs1pk: "COMPANY" }, { index: "gs1" });
  }

  async updateCompany(id: string, name: string) {
    return await CompanyModel.update({ id, name });
  }

  async deleteCompany(id: string) {
    return await CompanyModel.remove({ id });
  }
}

export class RegionService {
  async createRegion(input: CreateRegionInput) {
    return await RegionModel.create(input);
  }

  async getRegion(companyId: string, regionId: string) {
    return await RegionModel.get({ pk: `COMPANY#${companyId}`, sk: `REGION#${regionId}` });
  }

  async getRegionsByCompany(companyId: string) {
    return await RegionModel.find({ pk: `COMPANY#${companyId}` });
  }

  async getRegionByName(companyId: string, region_name: string) {
    return await RegionModel.find({ pk: `COMPANY#${companyId}`, region_name });
  }

  async updateRegion(input: UpdateRegionInput) {
    return await RegionModel.update({ 
      pk: `COMPANY#${input.companyId}`,
      sk: `REGION#${input.regionId}`,
      region_name: input.region_name, // updated value
     });
  }

  async deleteRegion(companyId: string,id: string) {
    return await RegionModel.remove({ 
      pk: `COMPANY#${companyId}`,
      id
    });
  }
}

export class BranchService {
  async createBranch(input: CreateBranchInput) {
    return await BranchModel.create(input);
  }

  async getBranch(regionId: string, branchId: string) {
    return await BranchModel.get({ 
      pk: `REGION#${regionId}`,
      id: branchId
    });
  }

  async getBranchesByRegion(regionId: string) {
    return await BranchModel.find({ pk: `REGION#${regionId}` });
  }

  async updateBranch(input: UpdateBranchInput) {
    return await BranchModel.update({  
      pk: `REGION#${input.regionId}`,
      sk: `BRANCH#${input.branchId}`,
      branch_name: input.branch_name,
      address: input.address
     });
  }

  async deleteBranch(id: string) {
    return await BranchModel.remove({ id });
  }
}
