import { RegionModel } from '../../core/dynamo';
import { CreateRegionInput, UpdateRegionInput } from './region.input';


export class RegionService {
  // Add new region to specific comapny
  async createRegion(input: CreateRegionInput) {
    return await RegionModel.create(input);
  }

  // get specific region of specific company By regionID
  async getRegion(companyId: string, regionId: string) {
    return await RegionModel.get({ pk: `COMPANY#${companyId}`, sk: `REGION#${regionId}` });
  }

  // get specific region of specific company By regionName
  async getRegionByName(companyId: string, region_name: string) {
    region_name = region_name.trim();
    return await RegionModel.find({ pk: `COMPANY#${companyId}`, region_name });
  }
  
  // get all region of a company
  async getRegionsByCompany(companyId: string) {
    return await RegionModel.find({ pk: `COMPANY#${companyId}` });
  }

  // Update region information
  async updateRegion(input: UpdateRegionInput) {
    const regionName = input.region_name.trim()
    return await RegionModel.update({ 
      pk: `COMPANY#${input.companyId}`,
      sk: `REGION#${input.regionId}`,
      region_name: regionName, // updated value
     });
  }


  // delete any region
  async deleteRegion(companyId: string,id: string) {
    return await RegionModel.remove({ 
      pk: `COMPANY#${companyId}`,
      id
    });
  }
}
