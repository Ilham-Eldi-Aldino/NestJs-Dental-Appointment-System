import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/auth.guard';
import { ScheduleService } from './schedule.service';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import { ScheduleModel } from './dto/schedule.model';
import { SchedulePagination } from './dto/schedule-pagination.model';

@Resolver(() => ScheduleModel)
@UseGuards(AuthGuard)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Mutation(() => ScheduleModel)
  createSchedule(@Args('input') input: CreateScheduleInput) {
    return this.scheduleService.createSchedule(input);
  }

  @Mutation(() => ScheduleModel)
  updateSchedule(@Args('input') input: UpdateScheduleInput) {
    return this.scheduleService.updateSchedule(input);
  }

  @Query(() => SchedulePagination)
  schedules(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
  ) {
    return this.scheduleService.findAll(page, limit);
  }

  @Query(() => ScheduleModel)
  schedule(@Args('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Mutation(() => ScheduleModel)
  deleteSchedule(@Args('id') id: string) {
    return this.scheduleService.deleteSchedule(id);
  }
}
