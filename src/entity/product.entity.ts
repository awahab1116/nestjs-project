import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class Product extends CommonEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true, default: 1 })
  quantity: number;
}
