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
export class UpdateBranchInput {
  @Field({ nullable: true })
  branch_name?: string;

  @Field({ nullable: true })
  address?: string;
}
