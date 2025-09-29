import { ObjectType, Field, ID } from 'type-graphql';


@ObjectType()
export class Branch {
  @Field(() => ID)
  id!: string;

  @Field()
  regionId!: string;

  @Field()
  branch_name!: string;

  @Field()
  address!: string;
}
