import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";
import { CreateBranchInput } from "../branch/branch.input";

@InputType()
export class CreateRegionInput {
  @Field()
  @IsNotEmpty()
  region_name!: string;

  @Field(() => [CreateBranchInput], { nullable: true })
  branches?: CreateBranchInput[];
}

@InputType()
export class UpdateRegionInput {
  @Field({ nullable: true })
  region_name?: string;
}
