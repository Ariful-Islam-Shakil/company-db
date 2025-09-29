import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Company {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  
}

@ObjectType()
export class Region {
  @Field(() => ID)
  id!: string;

  @Field()
  companyId!: string;

  @Field()
  region_name!: string;
}

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
