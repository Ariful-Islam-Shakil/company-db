import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Company } from "./company.type";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.input";
import { CompanyService } from "./company.service";

@Resolver(() => Company)
export class CompanyResolver {
  private companyService = new CompanyService();

  @Query(() => [Company])
  async listCompanies(): Promise<Company[]> {
    return this.companyService.listCompanies();
  }

  @Query(() => Company)
  async getCompany(@Arg("id") id: string): Promise<Company> {
    return this.companyService.getCompany(id);
  }

  @Query(() => Company)
  async getCompanyByName(@Arg("companyName") companyName: string): Promise<Company> {
    return this.companyService.getCompanyByName(companyName);
  }

  @Query(() => [Company])
  async companiesByRegion(@Arg("region_name") region_name: string): Promise<Company[]> {
    return this.companyService.companiesByRegion(region_name);
  }

  @Mutation(() => Company)
  async createCompany(@Arg("input") input: CreateCompanyInput): Promise<Company> {
    return this.companyService.createCompany(input);
  }

  @Mutation(() => Company)
  async updateCompany(
    @Arg("id") id: string,
    @Arg("input") input: UpdateCompanyInput
  ): Promise<Company> {
    return this.companyService.updateCompany(id, input);
  }

  @Mutation(() => Boolean)
  async deleteCompany(@Arg("id") id: string): Promise<boolean> {
    return this.companyService.deleteCompany(id);
  }
}
