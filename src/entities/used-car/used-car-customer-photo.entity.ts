// src/modules/used-car/entities/used-car-listing-photo.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { UsedCar } from './used-car.entity';

@Entity('used_car_customer_photos')
export class UsedCarCustomerPhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'used_car_id', type: 'int' })
    used_car_id: number;

    @Column({ name: 'url', type: 'varchar', length: 500 })
    url: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
    updatedAt: Date | null;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt: Date | null;

    // Relations
    @ManyToOne(() => UsedCar, (listing) => listing.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'used_car_id' })
    listing: UsedCar;
}