import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { Company } from './company.type';
import { Region } from '../region/region.type'
import { CreateCompanyInput} from './company.input';
import { CompanyService } from './company.service';
import { RegionService } from '../region/region.service';

@Resolver(() => Company)
export class CompanyResolver {
  private service = new CompanyService();
  private regionService = new RegionService();

  // get all companies
  @Query(() => [Company])
  async companies() {
    return this.service.listCompanies();
  }

  // get company by companyID
  @Query(() => Company, { nullable: true })
  async companyById(@Arg("companyId") companyId: string) {
    return this.service.getCompany(companyId);
  }

  // get company by company name
  @Query(() => [Company], { nullable: true })
  async companyByName(@Arg("name") name: string) {
    return this.service.getCompanyByName(name);
  }

  // create new company
  @Mutation(() => Company)
  async createCompany(@Arg("input") input: CreateCompanyInput) {
    return this.service.createCompany(input);
  }

  // Update a company
  @Mutation(() => Company)
  async updateCompany(@Arg("companyId") id: string, @Arg("name") name: string) {
    return this.service.updateCompany(id, name);
  }

  // Delete company by id
  @Mutation(() => Boolean)
  async deleteCompany(@Arg("companyId") id: string) {
    await this.service.deleteCompany(id);
    return true;
  }

  // fetch nested object data
  @FieldResolver(() => [Region])
  async regions(@Root() company: Company) {
    return this.regionService.getRegionsByCompany(company.id);
  }
}
