/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateScheduleInput {
  @Field()
  @IsString()
  id!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  customerId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  objective?: string;
}
