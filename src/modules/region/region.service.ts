import { RegionModel } from '../../core/dynamo';
import { CreateRegionInput, UpdateRegionInput } from './region.input';
import { GraphQLError } from 'graphql';


export class RegionService {
    // Add new region to specific company
  async createRegion(input: CreateRegionInput) {
    try {
      if (!input?.companyId) {
        throw new GraphQLError("Company ID is required.");
      }
      if (!input?.region_name?.trim()) {
        throw new GraphQLError("Region name is required.");
      }

      input.region_name = input.region_name.trim();
      const region = await RegionModel.create(input);

      if (!region) {
        throw new GraphQLError("Failed to create region.");
      }
      return region;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error creating region.");
    }
  }

  // Get specific region of specific company by regionID
  async getRegion(companyId: string, regionId: string) {
    try {
      if (!companyId || !regionId) {
        throw new GraphQLError("Company ID and Region ID are required.");
      }

      const region = await RegionModel.get({
        pk: `COMPANY#${companyId}`,
        sk: `REGION#${regionId}`,
      });

      if (!region) {
        throw new GraphQLError(
          `No region found with ID: ${regionId} for company: ${companyId}`
        );
      }
      return region;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error fetching region.");
    }
  }

  // Get specific region of a company by regionName
  async getRegionByName(companyId: string, region_name: string) {
    try {
      if (!companyId) {
        throw new GraphQLError("Company ID is required.");
      }
      region_name = region_name?.trim();
      if (!region_name) {
        throw new GraphQLError("Region name is required.");
      }

      const regions = await RegionModel.find({
        pk: `COMPANY#${companyId}`,
        region_name,
      });

      if (!regions || regions.length === 0) {
        throw new GraphQLError(
          `No region found with name: ${region_name} for company: ${companyId}`
        );
      }
      return regions;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error fetching region by name.");
    }
  }

  // Get all regions of a company
  async getRegionsByCompany(companyId: string) {
    try {
      if (!companyId) {
        throw new GraphQLError("Company ID is required.");
      }

      const regions = await RegionModel.find({ pk: `COMPANY#${companyId}` });

      if (!regions || regions.length === 0) {
        throw new GraphQLError(`No regions found for company: ${companyId}`);
      }
      return regions;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error fetching regions by company.");
    }
  }

  // Update region information
  async updateRegion(input: UpdateRegionInput) {
    try {
      if (!input?.companyId || !input?.regionId) {
        throw new GraphQLError("Company ID and Region ID are required.");
      }
      if (!input?.region_name?.trim()) {
        throw new GraphQLError("Region name is required.");
      }

      const updated = await RegionModel.update({
        pk: `COMPANY#${input.companyId}`,
        sk: `REGION#${input.regionId}`,
        region_name: input.region_name.trim(),
      });

      if (!updated) {
        throw new GraphQLError(
          `No region found with ID: ${input.regionId} for update.`
        );
      }
      return updated;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error updating region.");
    }
  }

  // Delete any region
  async deleteRegion(companyId: string, id: string) {
    try {
      if (!companyId || !id) {
        throw new GraphQLError("Company ID and Region ID are required.");
      }

      const deleted = await RegionModel.remove({
        pk: `COMPANY#${companyId}`,
        id,
      });

      if (!deleted) {
        throw new GraphQLError(
          `No region found with ID: ${id} for company: ${companyId}`
        );
      }
      return deleted;
    } catch (err: any) {
      throw new GraphQLError(err.message || "Error deleting region.");
    }
  }
}
