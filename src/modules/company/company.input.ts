import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";
import { CreateRegionInput } from "../region/region.input";

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
