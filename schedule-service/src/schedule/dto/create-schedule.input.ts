/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  doctorId!: string;

  @Field()
  @IsDateString()
  scheduledAt!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  objective!: string;
}
