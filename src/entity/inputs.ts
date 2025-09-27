import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateBranchInput {
  @Field()
  @IsNotEmpty()
  branch_name!: string;

  @Field()
  @IsNotEmpty()
  address!: string;
}

@InputType()
export class CreateRegionInput {
  @Field()
  @IsNotEmpty()
  region_name!: string;

  @Field(() => [CreateBranchInput], { nullable: true })
  branches?: CreateBranchInput[];
}

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field(() => [CreateRegionInput], { nullable: true })
  regions?: CreateRegionInput[];
}

@InputType()
export class UpdateCompanyInput {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class UpdateRegionInput {
  @Field({ nullable: true })
  region_name?: string;
}

@InputType()
export class UpdateBranchInput {
  @Field({ nullable: true })
  branch_name?: string;

  @Field({ nullable: true })
  address?: string;
}
