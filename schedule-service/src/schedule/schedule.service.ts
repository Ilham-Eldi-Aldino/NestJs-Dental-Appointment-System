/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';

import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,

    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async createSchedule(input: CreateScheduleInput) {
    const customer = await this.validateCustomer(input.customerId);
    const doctor = await this.validateDoctor(input.doctorId);

    const scheduledAt = new Date(input.scheduledAt);

    const existingSchedule = await this.prisma.schedule.findFirst({
      where: {
        doctorId: input.doctorId,
        scheduledAt,
      },
    });

    if (existingSchedule) {
      throw new BadRequestException(
        'Doctor already has a schedule at this time',
      );
    }

    const createdSchedule = await this.prisma.schedule.create({
      data: {
        customerId: input.customerId,
        doctorId: input.doctorId,
        scheduledAt,
        objective: input.objective,
      },
    });

    await this.emailQueue.add('schedule-created', {
      customerEmail: customer.email,
      customerName: customer.name,
      doctorName: doctor.name,
      scheduleDate: createdSchedule.scheduledAt,
    });

    return createdSchedule;
  }

  async updateSchedule(input: UpdateScheduleInput) {
    const currentSchedule = await this.findOne(input.id);

    const customerId = input.customerId ?? currentSchedule.customerId;
    const doctorId = input.doctorId ?? currentSchedule.doctorId;
    const scheduledAt = input.scheduledAt
      ? new Date(input.scheduledAt)
      : currentSchedule.scheduledAt;

    const objective = input.objective ?? currentSchedule.objective;

    await this.validateCustomer(customerId);
    await this.validateDoctor(doctorId);

    const conflictingSchedule = await this.prisma.schedule.findFirst({
      where: {
        doctorId,
        scheduledAt,
        NOT: {
          id: input.id,
        },
      },
    });

    if (conflictingSchedule) {
      throw new BadRequestException(
        'Doctor already has a schedule at this time',
      );
    }

    return this.prisma.schedule.update({
      where: {
        id: input.id,
      },
      data: {
        customerId,
        doctorId,
        scheduledAt,
        objective,
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.schedule.findMany({
        skip,
        take: limit,
        orderBy: {
          scheduledAt: 'asc',
        },
      }),
      this.prisma.schedule.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async deleteSchedule(id: string) {
    const schedule = await this.findOne(id);

    const customer = await this.validateCustomer(schedule.customerId);
    const doctor = await this.validateDoctor(schedule.doctorId);

    const deletedSchedule = await this.prisma.schedule.delete({
      where: {
        id,
      },
    });

    await this.emailQueue.add('schedule-deleted', {
      customerEmail: customer.email,
      customerName: customer.name,
      doctorName: doctor.name,
      scheduleDate: schedule.scheduledAt,
    });

    return deletedSchedule;
  }

  private async validateCustomer(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  private async validateDoctor(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }
}
