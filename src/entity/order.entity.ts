import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { OrderStatus } from '../constant/order-status.enum';

@Entity()
export class Order extends CommonEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.INITIALIZED,
  })
  status: OrderStatus;

  @Column({
    nullable: true,
    unique: true,
  })
  checkoutSessionId: string;

  @ManyToMany(() => Product, { eager: true, cascade: true })
  @JoinTable()
  products: Product[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
