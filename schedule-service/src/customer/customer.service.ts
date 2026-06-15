import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(input: CreateCustomerInput) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingCustomer) {
      throw new BadRequestException('Customer email already registered');
    }

    return this.prisma.customer.create({
      data: {
        name: input.name,
        email: input.email,
      },
    });
  }

  async updateCustomer(input: UpdateCustomerInput) {
    await this.findOne(input.id);

    if (input.email) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingCustomer && existingCustomer.id !== input.id) {
        throw new BadRequestException('Customer email already registered');
      }
    }

    return this.prisma.customer.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        email: input.email,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.customer.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async deleteCustomer(id: string) {
    await this.findOne(id);

    return this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
