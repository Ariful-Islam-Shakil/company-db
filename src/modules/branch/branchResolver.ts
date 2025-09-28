import { Resolver, Mutation, Arg } from "type-graphql";
import { Branch } from "./branch.type";
import { CreateBranchInput, UpdateBranchInput } from "./branch.input";
import { BranchService } from "./branch.service";

@Resolver(() => Branch)
export class BranchResolver {
  private branchService = new BranchService();

  @Mutation(() => Branch)
  async addBranch(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("input") input: CreateBranchInput
  ): Promise<Branch> {
    return this.branchService.addBranch(companyId, regionId, input);
  }

  @Mutation(() => Branch)
  async updateBranch(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("branchId") branchId: string,
    @Arg("input") input: UpdateBranchInput
  ): Promise<Branch> {
    return this.branchService.updateBranch(companyId, regionId, branchId, input);
  }

  @Mutation(() => Boolean)
  async deleteBranch(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("branchId") branchId: string
  ): Promise<boolean> {
    return this.branchService.deleteBranch(companyId, regionId, branchId);
  }
}
