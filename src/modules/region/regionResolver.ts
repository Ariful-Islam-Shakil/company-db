import { Resolver, Mutation, Arg } from "type-graphql";
import { Region } from "./region.type";
import { CreateRegionInput, UpdateRegionInput } from "./region.input";
import { RegionService } from "./region.service";

@Resolver(() => Region)
export class RegionResolver {
  private regionService = new RegionService();

  @Mutation(() => Region)
  async addRegion(
    @Arg("companyId") companyId: string,
    @Arg("input") input: CreateRegionInput
  ): Promise<Region> {
    return this.regionService.addRegion(companyId, input);
  }

  @Mutation(() => Region)
  async updateRegion(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string,
    @Arg("input") input: UpdateRegionInput
  ): Promise<Region> {
    return this.regionService.updateRegion(companyId, regionId, input);
  }

  @Mutation(() => Boolean)
  async deleteRegion(
    @Arg("companyId") companyId: string,
    @Arg("regionId") regionId: string
  ): Promise<boolean> {
    return this.regionService.deleteRegion(companyId, regionId);
  }
}
