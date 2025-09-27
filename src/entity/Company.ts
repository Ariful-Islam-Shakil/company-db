import { Field, ID, ObjectType } from "type-graphql";
import { Region } from "./Region";

@ObjectType()
export class Company {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [Region])
  regions!: Region[];

  @Field()
  createdAt!: string;
}
