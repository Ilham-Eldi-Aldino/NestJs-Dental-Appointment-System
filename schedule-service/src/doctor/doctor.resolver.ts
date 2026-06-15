import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/auth.guard';
import { DoctorService } from './doctor.service';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { DoctorModel } from './dto/doctor.model';
import { DoctorPagination } from './dto/doctor-pagination.model';

@Resolver(() => DoctorModel)
@UseGuards(AuthGuard)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Mutation(() => DoctorModel)
  createDoctor(@Args('input') input: CreateDoctorInput) {
    return this.doctorService.createDoctor(input);
  }

  @Mutation(() => DoctorModel)
  updateDoctor(@Args('input') input: UpdateDoctorInput) {
    return this.doctorService.updateDoctor(input);
  }

  @Query(() => DoctorPagination)
  doctors(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
  ) {
    return this.doctorService.findAll(page, limit);
  }

  @Query(() => DoctorModel)
  doctor(@Args('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Mutation(() => DoctorModel)
  deleteDoctor(@Args('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }
}
