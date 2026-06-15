import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DoctorModel } from './doctor.model';

@ObjectType()
export class DoctorPagination {
  @Field(() => [DoctorModel])
  data!: DoctorModel[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;
}
