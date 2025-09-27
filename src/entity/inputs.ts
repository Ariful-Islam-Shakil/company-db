// src/entity/inputs.ts
import { InputType, Field, ID } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateLocationInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsNotEmpty()
  address!: string;
}

@InputType()
export class CreateBranchInput {
  @Field()
  @IsNotEmpty()
  region!: string;

  @Field(() => [CreateLocationInput], { nullable: true })
  locations?: CreateLocationInput[];
}

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field(() => [CreateBranchInput], { nullable: true })
  branches?: CreateBranchInput[];
}

@InputType()
export class UpdateCompanyInput {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class UpdateBranchInput {
  @Field({ nullable: true })
  region?: string;
}

@InputType()
export class UpdateLocationInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;
}
