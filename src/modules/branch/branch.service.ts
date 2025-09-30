import { GraphQLError } from "graphql";
import { BranchModel } from "../../core/dynamo";
import { CreateBranchInput, UpdateBranchInput } from "./branch.input";

export class BranchService {
  // Create new branch under a region
  async createBranch(input: CreateBranchInput) {
    try {
      if (!input?.regionId) {
        throw new GraphQLError("Region ID is required.");
      }
      if (!input?.branch_name?.trim()) {
        throw new GraphQLError("Branch name is required.");
      }

      input.branch_name = input.branch_name.trim();
      if (input.address) {
        input.address = input.address.trim();
      }

      const branch = await BranchModel.create(input);

      if (!branch) {
        throw new GraphQLError("Failed to create branch.");
      }
      return branch;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error creating branch.");
    }
  }

  // Get specific branch of a region by branchId
  async getBranch(regionId: string, branchId: string) {
    try {
      if (!regionId || !branchId) {
        throw new GraphQLError("Region ID and Branch ID are required.");
      }

      const branch = await BranchModel.get({
        pk: `REGION#${regionId}`,
        sk: `BRANCH#${branchId}`,
      });

      if (!branch) {
        throw new GraphQLError(
          `No branch found with ID: ${branchId} for region: ${regionId}`
        );
      }
      return branch;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error fetching branch.");
    }
  }

  // Get all branches of a region
  async getBranchesByRegion(regionId: string) {
    try {
      if (!regionId) {
        throw new GraphQLError("Region ID is required.");
      }

      const branches = await BranchModel.find({ pk: `REGION#${regionId}` });

      if (!branches || branches.length === 0) {
        throw new GraphQLError(`No branches found for region: ${regionId}`);
      }
      return branches;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error fetching branches by region.");
    }
  }

  // Update branch information
  async updateBranch(input: UpdateBranchInput) {
    try {
      if (!input?.regionId || !input?.branchId) {
        throw new GraphQLError("Region ID and Branch ID are required.");
      }
      if (!input?.branch_name?.trim()) {
        throw new GraphQLError("Branch name is required.");
      }

      const updated = await BranchModel.update({
        pk: `REGION#${input.regionId}`,
        sk: `BRANCH#${input.branchId}`,
        branch_name: input.branch_name.trim(),
        address: input.address ? input.address.trim() : undefined,
      });

      if (!updated) {
        throw new GraphQLError(
          `No branch found with ID: ${input.branchId} for update.`
        );
      }
      return updated;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error updating branch.");
    }
  }

  // Delete a branch
  async deleteBranch(regionId: string, id: string) {
    try {
      if (!regionId || !id) {
        throw new GraphQLError("Region ID and Branch ID are required.");
      }

      const deleted = await BranchModel.remove({
        pk: `REGION#${regionId}`,
        id,
      });

      if (!deleted) {
        throw new GraphQLError(
          `No branch found with ID: ${id} for region: ${regionId}`
        );
      }
      return deleted;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error deleting branch.");
    }
  }
}
