import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Region {
  @Field(() => ID)
  id!: string;

  @Field()
  companyId!: string;

  @Field()
  region_name!: string;
}

