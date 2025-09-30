import { Resolver, Query, Arg, Int, FieldResolver, Root, Mutation } from "type-graphql";
import { Company,  PaginatedCompanies } from "../company/company.type";
import { CreateCompanyInput } from "./company.input"
import { CompanyService } from "./company.service";
import { Region } from '../region/region.type';
import { RegionService } from '../region/region.service';

@Resolver(() => Company)
export class CompanyResolver {
  private regionService = new RegionService()
  private companyService = new CompanyService()
  
  @Query(() => PaginatedCompanies)
  async companies(
    @Arg("first", () => Int, { defaultValue: 10 }) first: number,
    @Arg("after", { nullable: true }) after?: string
  ): Promise<PaginatedCompanies> {
    return await this.companyService.listCompaniesPaginated(first, after);
  }
  // create new company
  @Mutation(() => Company)
  async createCompany(@Arg("input") input: CreateCompanyInput) {
    return this.companyService.createCompany(input);
  }
  // get company by company name
  @Query(() => [Company], { nullable: true })
  async companyByName(@Arg("name") name: string) {
    return this.companyService.getCompanyByName(name);
  }
  // Update a company
  @Mutation(() => Company)
  async updateCompany(@Arg("companyId") id: string, @Arg("name") name: string) {
    return this.companyService.updateCompany(id, name);
  }
  // Delete company by id
  @Mutation(() => Boolean)
  async deleteCompany(@Arg("companyId") id: string) {
    await this.companyService.deleteCompany(id);
    return true;
  }

  // fetch nested object data
  @FieldResolver(() => [Region], { nullable: true })
  async regions(@Root() company: Company) {
    if (!company || !company.id) {
      return null;
    }
    return this.regionService.getRegionsByCompany(company.id);
  }
}
