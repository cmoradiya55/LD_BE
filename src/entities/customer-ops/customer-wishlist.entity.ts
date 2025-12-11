import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { Customer } from '@entity/customer/customer.entity';

@Entity('customer_wishlists')
export class CustomerWishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customer_id: number;

    @Column({ name: 'used_car_id' })
    used_car_id: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at: Date;

    // Relations
    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => UsedCar)
    @JoinColumn({ name: 'used_car_id' })
    usedCar: UsedCar;
}