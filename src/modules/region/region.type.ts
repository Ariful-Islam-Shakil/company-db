import { Field, ID, ObjectType } from "type-graphql";
import { Branch } from "../branch/branch.type";

@ObjectType()
export class Region {
  @Field(() => ID)
  id!: string;

  @Field()
  region_name!: string;

  @Field(() => [Branch])
  branches!: Branch[];
}
