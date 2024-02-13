import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Represents a common entity with basic properties.
 */
export abstract class CommonEntity extends BaseEntity {
  /**
   * The unique identifier of the entity.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The date and time when the entity was last updated.
   */
  @Column()
  updatedAt: Date;

  /**
   * The date and time when the entity was created.
   */
  @Column()
  createdAt: Date;
}
