import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CustomerModel } from './customer.model';

@ObjectType()
export class CustomerPagination {
  @Field(() => [CustomerModel])
  data: CustomerModel[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
