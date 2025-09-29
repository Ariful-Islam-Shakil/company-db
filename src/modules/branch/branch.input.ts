import { InputType, Field } from 'type-graphql'; 

@InputType()
export class CreateBranchInput {
  @Field()
  companyId!: string;

  @Field()
  regionId!: string;

  @Field()
  branch_name!: string;

  @Field()
  address!: string;
}

@InputType()
export class UpdateBranchInput{
  @Field()
  regionId!: string;

  @Field()
  branchId!: string;

  @Field({ nullable: true })
  branch_name?: string;

  @Field({ nullable: true })
  address?: string;
}