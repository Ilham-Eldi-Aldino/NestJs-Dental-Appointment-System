import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ScheduleModel } from './schedule.model';

@ObjectType()
export class SchedulePagination {
  @Field(() => [ScheduleModel])
  data!: ScheduleModel[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;
}
