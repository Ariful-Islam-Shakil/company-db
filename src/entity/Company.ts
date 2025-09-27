// src/entity/Company.ts
import { Field, ID, ObjectType } from "type-graphql";
import { Branch } from "./Branch";

@ObjectType()
export class Company {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [Branch])
  branches!: Branch[];

  @Field()
  createdAt!: string;
}
