import { BranchModel } from '../../core/dynamo';
import { CreateBranchInput, UpdateBranchInput } from './branch.input';


export class BranchService {
  // Create new branch to specific company
  async createBranch(input: CreateBranchInput) {
    return await BranchModel.create(input);
  }

  // get specific branch of specific region by RegionId
  async getBranch(regionId: string, branchId: string) {
    return await BranchModel.get({ 
      pk: `REGION#${regionId}`,
      id: branchId
    });
  }

  // get all branches of specific region
  async getBranchesByRegion(regionId: string) {
    return await BranchModel.find({ pk: `REGION#${regionId}` });
  }

  // Update branch information
  async updateBranch(input: UpdateBranchInput) {
    return await BranchModel.update({  
      pk: `REGION#${input.regionId}`,
      sk: `BRANCH#${input.branchId}`,
      branch_name: input.branch_name,
      address: input.address
     });
  }

  // Delete any branch
  async deleteBranch(regionId: string, id: string) {
    return await BranchModel.remove({ 
      pk: `REGION#${regionId}`,
      id 
    });
  }
}
