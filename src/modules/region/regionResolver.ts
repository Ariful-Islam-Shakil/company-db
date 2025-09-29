import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { Region } from './region.type';
import { Branch } from '../branch/branch.type'
import { CreateRegionInput, UpdateRegionInput } from './region.input';
import { RegionService } from './region.service';
import { BranchService } from '../branch/branch.service';


@Resolver(() => Region)
export class RegionResolver {
  private service = new RegionService();
  private branchService = new BranchService();

  // get all region of a company
  @Query(() => [Region])
  async regions(@Arg("companyId") companyId: string) {
    return this.service.getRegionsByCompany(companyId);
  }

  // get specific region of specific company By regionID
  @Query(() => Region, { nullable: true })
  async regionById(@Arg("companyId") companyId: string,@Arg("regionId") regionId: string) {
    return this.service.getRegion(companyId,regionId);
  }

  // get specific region of specific company By regionName
  @Query(() => [Region], { nullable: true })
  async regionByName(@Arg("companyId") companyId: string, @Arg("region_name") region_name: string) {
    return this.service.getRegionByName(companyId, region_name);
  }

  // Add new region to specific comapny
  @Mutation(() => Region)
  async createRegion(@Arg("input") input: CreateRegionInput) {
    return this.service.createRegion(input);
  }

  // Update region information
  @Mutation(() => Region)
  async updateRegion(@Arg("input") input: UpdateRegionInput) {
    return this.service.updateRegion(input);
  }

  // delete any region
  @Mutation(() => Boolean)
  async deleteRegion(@Arg("companyId") companyId: string ,@Arg("regionId") id: string) {
    await this.service.deleteRegion(companyId,id);
    return true;
  }

  @FieldResolver(() => [Branch])
  async branches(@Root() region: Region) {
    return this.branchService.getBranchesByRegion(region.id);
  }
}
