import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { Company, Region, Branch } from './company.type';
import { CreateCompanyInput, CreateRegionInput, CreateBranchInput, UpdateRegionInput, UpdateBranchInput } from './company.input';
import { CompanyService, RegionService, BranchService } from './company.service';

@Resolver(() => Company)
export class CompanyResolver {
  private service = new CompanyService();
  private regionService = new RegionService();

  @Query(() => [Company])
  async companies() {
    return this.service.listCompanies();
  }

  @Query(() => Company, { nullable: true })
  async companyById(@Arg("companyId") companyId: string) {
    return this.service.getCompany(companyId);
  }

  @Query(() => [Company], { nullable: true })
  async companyByName(@Arg("name") name: string) {
    return this.service.getCompanyByName(name);
  }

  @Mutation(() => Company)
  async createCompany(@Arg("input") input: CreateCompanyInput) {
    return this.service.createCompany(input);
  }

  @Mutation(() => Company)
  async updateCompany(@Arg("companyId") id: string, @Arg("name") name: string) {
    return this.service.updateCompany(id, name);
  }

  @Mutation(() => Boolean)
  async deleteCompany(@Arg("companyId") id: string) {
    await this.service.deleteCompany(id);
    return true;
  }

  @FieldResolver(() => [Region])
  async regions(@Root() company: Company) {
    return this.regionService.getRegionsByCompany(company.id);
  }
}

@Resolver(() => Region)
export class RegionResolver {
  private service = new RegionService();
  private branchService = new BranchService();

  @Query(() => [Region])
  async regions(@Arg("companyId") companyId: string) {
    return this.service.getRegionsByCompany(companyId);
  }

  @Query(() => Region, { nullable: true })
  async regionById(@Arg("companyId") companyId: string,@Arg("regionId") regionId: string) {
    return this.service.getRegion(companyId,regionId);
  }

  @Query(() => [Region], { nullable: true })
  async regionByName(@Arg("companyId") companyId: string, @Arg("region_name") region_name: string) {
    return this.service.getRegionByName(companyId, region_name);
  }

  @Mutation(() => Region)
  async createRegion(@Arg("input") input: CreateRegionInput) {
    return this.service.createRegion(input);
  }

  @Mutation(() => Region)
  async updateRegion(@Arg("input") input: UpdateRegionInput) {
    return this.service.updateRegion(input);
  }

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

@Resolver(() => Branch)
export class BranchResolver {
  private service = new BranchService();

  @Query(() => [Branch])
  async branches(@Arg("regionId") regionId: string) {
    return this.service.getBranchesByRegion(regionId);
  }

  @Query(() => Branch, { nullable: true })
  async branchById(@Arg("regionId") regionId: string ,@Arg("branchId") branchId: string) {
    return this.service.getBranch(regionId, branchId);
  }

  @Mutation(() => Branch)
  async createBranch(@Arg("input") input: CreateBranchInput) {
    return this.service.createBranch(input);
  }

  @Mutation(() => Branch)
  async updateBranch(@Arg("input") input: UpdateBranchInput) {
    return this.service.updateBranch(input);
  }

  @Mutation(() => Boolean)
  async deleteBranch(@Arg("branchId") id: string) {
    await this.service.deleteBranch(id);
    return true;
  }
}
