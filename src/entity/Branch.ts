import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Branch {
  @Field(() => ID)
  id!: string;

  @Field()
  branch_name!: string;

  @Field()
  address!: string;
}
