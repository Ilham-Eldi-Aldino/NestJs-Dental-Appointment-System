import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateDoctorInput {
  @Field()
  @IsString()
  id!: string;

  @Field()
  @IsNotEmpty()
  name!: string;
}
