import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async createDoctor(input: CreateDoctorInput) {
    return this.prisma.doctor.create({
      data: {
        name: input.name,
      },
    });
  }

  async updateDoctor(input: UpdateDoctorInput) {
    await this.findOne(input.id);

    return this.prisma.doctor.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.doctor.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.doctor.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async deleteDoctor(id: string) {
    await this.findOne(id);

    return this.prisma.doctor.delete({
      where: {
        id,
      },
    });
  }
}
