import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from '@/utils/exception';

import { UserEntity, UserEntitySchema } from '../entity/user';
import { IUserRepository } from '../repository/user';

export const UserGetByIdSchema = UserEntitySchema.pick({
  id: true
});

export type UserGetByIDInput = z.infer<typeof UserGetByIdSchema>;
export type UserGetByIDOutput = Promise<UserEntity>;

export class UserGetByIdUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  @ValidateSchema(UserGetByIdSchema)
  async execute({ id }: UserGetByIDInput): Promise<UserGetByIDOutput> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ApiNotFoundException('userNotFound');
    }

    const entity = new UserEntity(user);
    entity.anonymizePassword();

    return entity;
  }
}
