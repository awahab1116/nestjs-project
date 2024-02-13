import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class Product extends CommonEntity {
  /**
   * The name of the product.
   */
  @Column()
  name: string;

  /**
   * The description of the product.
   */
  @Column({ nullable: true })
  description: string;

  /**
   * The price of the product.
   */
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  /**
   * The quantity of the product.
   */
  @Column({ default: 1 })
  quantity: number;

  /**
   * The image URL of the product.
   */
  @Column({ nullable: true })
  image: string;
}
