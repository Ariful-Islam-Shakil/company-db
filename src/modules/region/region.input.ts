import { InputType, Field } from 'type-graphql'; 

@InputType()
export class CreateRegionInput {
  @Field()
  companyId!: string;

  @Field()
  region_name!: string;
}

@InputType()
export class UpdateRegionInput{
  @Field()
  companyId!: string;

  @Field()
  regionId!: string;

  @Field()
  region_name!: string;
}