import { Resolver, Query, Mutation, Arg} from 'type-graphql';
import { Branch } from './branch.type'
import {  CreateBranchInput, UpdateBranchInput } from './branch.input';
import { BranchService } from './branch.service';



@Resolver(() => Branch)
export class BranchResolver {
  private service = new BranchService();

  // get all branches of specific region
  @Query(() => [Branch])
  async branches(@Arg("regionId") regionId: string) {
    return this.service.getBranchesByRegion(regionId);
  }

  // get specific branch of specific region by RegionId
  @Query(() => Branch, { nullable: true })
  async branchById(@Arg("regionId") regionId: string ,@Arg("branchId") branchId: string) {
    return this.service.getBranch(regionId, branchId);
  }

  // Create new branch to specific company
  @Mutation(() => Branch)
  async createBranch(@Arg("input") input: CreateBranchInput) {
    return this.service.createBranch(input);
  }

  // Update branch information
  @Mutation(() => Branch)
  async updateBranch(@Arg("input") input: UpdateBranchInput) {
    return this.service.updateBranch(input);
  }

  // Delete any branch
  @Mutation(() => Boolean)
  async deleteBranch(@Arg("regionId") regionId:string, @Arg("branchId") id: string) {
    await this.service.deleteBranch(regionId, id);
    return true;
  }
}
