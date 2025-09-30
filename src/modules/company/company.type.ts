import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Company {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}


@ObjectType()
export class CompanyEdge {
  @Field()
  cursor!: string;

  @Field(() => Company)
  node!: Company;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage!: boolean;

  @Field(() => String, { nullable: true }) 
  endCursor?: string | null;
}

@ObjectType()
export class PaginatedCompanies {
  @Field(() => [CompanyEdge])
  edges!: CompanyEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;

  @Field({ nullable: true })
  totalCount?: number;
}
