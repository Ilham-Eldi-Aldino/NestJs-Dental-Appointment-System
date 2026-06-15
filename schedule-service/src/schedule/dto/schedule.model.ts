import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ScheduleModel {
  @Field()
  id!: string;

  @Field()
  customerId!: string;

  @Field()
  doctorId!: string;

  @Field()
  scheduledAt!: Date;

  @Field()
  objective!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
