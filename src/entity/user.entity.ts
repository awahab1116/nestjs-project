import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

/**
 * Represents a User entity.
 */
@Entity()
export class User extends CommonEntity {
  /**
   * The first name of the user.
   */
  @Column({ nullable: true })
  firstName: string;

  /**
   * The last name of the user.
   */
  @Column({ nullable: true })
  lastName: string;

  /**
   * The email address of the user.
   */
  @Column()
  email: string;

  /**
   * The password of the user.
   */
  @Column()
  @Exclude()
  password: string;

  /**
   * The profile image of the user.
   */
  @Column({ nullable: true })
  profileImage: string;
}
