import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entity/user.entity';

/**
 * Retrieves the user profile based on the provided user ID.
 * @param userId - The ID of the user.
 * @returns A Promise that resolves to the user profile.
 */
@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async userProfile(userId: number) {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }
}
