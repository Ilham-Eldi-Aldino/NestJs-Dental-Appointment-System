import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CustomerService } from './customer.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { CustomerModel } from './dto/customer.model';
import { CustomerPagination } from './dto/customer-pagination.model';

@Resolver(() => CustomerModel)
@UseGuards(AuthGuard)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => CustomerModel)
  createCustomer(@Args('input') input: CreateCustomerInput) {
    return this.customerService.createCustomer(input);
  }

  @Mutation(() => CustomerModel)
  updateCustomer(@Args('input') input: UpdateCustomerInput) {
    return this.customerService.updateCustomer(input);
  }

  @Query(() => CustomerPagination)
  customers(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
  ) {
    return this.customerService.findAll(page, limit);
  }

  @Query(() => CustomerModel)
  customer(@Args('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Mutation(() => CustomerModel)
  deleteCustomer(@Args('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }
}
