import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { OrderStatus } from '../constant/order-status.enum';

/**
 * Represents an order in the e-commerce application.
 */
@Entity()
export class Order extends CommonEntity {
  /**
   * The total amount of the order.
   */
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  /**
   * The status of the order.
   */
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.INITIALIZED,
  })
  status: OrderStatus;

  /**
   * The ID of the checkout session associated with the order.
   */
  @Column({
    nullable: true,
    unique: true,
  })
  checkoutSessionId: string;

  /**
   * The products included in the order.
   */
  @ManyToMany(() => Product, { eager: true, cascade: true })
  @JoinTable()
  products: Product[];

  /**
   * The user who placed the order.
   */
  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
