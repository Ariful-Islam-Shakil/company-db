// src/entity/Branch.ts
import { Field, ID, ObjectType } from "type-graphql";
import { Location } from "./Location";

@ObjectType()
export class Branch {
  @Field(() => ID)
  id!: string;

  @Field()
  region!: string;

  @Field(() => [Location])
  locations!: Location[];
}
