// src/modules/used-car/entities/used-car-listing.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { CarBrand } from '@entity/car/car-brand.entity';
import { CarModel } from '@entity/car/car-model.entity';
import { CarVariant } from '@entity/car/car-variant.entity';
import { Pincode } from '@entity/general/pincode.entity';
import { UsedCarCustomerPhoto } from './used-car-customer-photo.entity';
import { KilometerDriven, OwnershipType, UsedCarListingStatus } from '@common/enums/car-detail.enum';

@Entity('used_car')
export class UsedCar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int' })
    user_id: number;

    // Car details
    @Column({ name: 'brand_id', type: 'int' })
    brand_id: number;

    @Column({ name: 'model_id', type: 'int' })
    model_id: number;

    @Column({ name: 'variant_id', type: 'int' })
    variant_id: number;

    @Column({ name: 'registration_year', type: 'smallint' })
    registration_year: number;

    // Ownership & usage
    @Column({ name: 'owner_type', type: 'smallint' })
    owner_type: OwnershipType;

    @Column({ name: 'km_driven_range', type: 'smallint' })
    km_driven_range: KilometerDriven;

    @Column({ name: 'km_driven', type: 'int', nullable: true })
    km_driven: number | null;

    @Column({ name: 'registration_number', type: 'varchar', length: 20 })
    registration_number: string;

    // Location
    @Column({ name: 'pincode_id', type: 'int' })
    pincode_id: number;
    // Pricing
    @Column({ name: 'expected_price', type: 'bigint' })
    expected_price: number;

    @Column({ name: 'final_price', type: 'bigint', nullable: true })
    final_price: number | null;

    // Additional car info
    @Column({ name: 'insurance_validity', type: 'date', nullable: true })
    insurance_validity: Date | null;
    // Status tracking
    @Column({ name: 'status', type: 'smallint', default: UsedCarListingStatus.PENDING })
    status: UsedCarListingStatus;

    @Column({ name: 'rejection_reason', type: 'text', nullable: true })
    rejection_reason: string | null;

    // Verification
    @Column({ name: 'is_verified', type: 'boolean', default: false })
    is_verified: boolean;
    @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
    verified_at: Date | null;

    @Column({ name: 'verified_by', type: 'int', nullable: true })
    verified_by: number | null;

    // Timestamps
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at: Date;
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deleted_at: Date | null;

    // Relations
    @ManyToOne(() => CarBrand)
    @JoinColumn({ name: 'brand_id' })
    brand: CarBrand;

    @ManyToOne(() => CarModel)
    @JoinColumn({ name: 'model_id' })
    model: CarModel;

    @ManyToOne(() => CarVariant)
    @JoinColumn({ name: 'variant_id' })
    variant: CarVariant;

    @ManyToOne(() => Pincode)
    @JoinColumn({ name: 'pincode_id' })
    pincode: Pincode;

    @OneToMany(() => UsedCarCustomerPhoto, (photo) => photo.listing)
    photos: UsedCarCustomerPhoto[];
}