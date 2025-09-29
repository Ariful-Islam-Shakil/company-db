import { InputType, Field } from 'type-graphql';
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field(() => [CreateRegionInput], { nullable: true })
  regions?: CreateRegionInput[];
}

@InputType()
export class CreateRegionInput {
  @Field()
  companyId!: string;

  @Field()
  region_name!: string;
}

@InputType()
export class CreateBranchInput {
  @Field()
  companyId!: string;

  @Field()
  regionId!: string;

  @Field()
  branch_name!: string;

  @Field()
  address!: string;
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

@InputType()
export class UpdateBranchInput{
  @Field()
  regionId!: string;

  @Field()
  branchId!: string;

  @Field({ nullable: true })
  branch_name?: string;

  @Field({ nullable: true })
  address?: string;
}