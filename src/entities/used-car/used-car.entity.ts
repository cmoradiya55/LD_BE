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
import { InspectionImage } from './inspection-image.entity';
import { CustomerWishlist } from '@entity/customer-ops/customer-wishlist.entity';
import { User } from '@entity/user/user.entity';
import { Customer } from '@entity/customer/customer.entity';

@Entity('used_car')
export class UsedCar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'slug', type: 'varchar', length: 255 })
    slug: string;

    @Column({ name: 'rc_image', nullable: true, type: 'varchar', length: 255 })
    rc_image: string;

    @Column({ name: 'insurance_image', nullable: true, type: 'varchar', length: 255 })
    insurance_image: string;

    @Column({ name: 'customer_id', type: 'int' })
    customer_id: number;

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

    @Column({ name: 'registration_number_clean', type: 'varchar', length: 20 })
    registration_number_clean: string;

    @Column({ name: 'rto_code', type: 'varchar', length: 10 })
    rto_code: string;

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

    @Column({ name: 'inspection_assigned_to', type: 'int', nullable: true })
    inspection_assigned_to: number | null;

    @Column({ name: 'assigned_by', type: 'int', nullable: true })
    assigned_by: number | null;

    @Column({ type: 'date', nullable: true })
    registration_date: Date;

    @Column({ type: 'date', nullable: true })
    fitness_valid_until: Date;

    @Column({ type: 'date', nullable: true })
    insurance_valid_until: Date;

    @Column({ type: 'date', nullable: true })
    puc_valid_until: Date;

    @Column({ type: 'jsonb', nullable: true , default: {}})
    challan_details: Record<string, any>;

    @Column({ type: 'boolean', default: false })
    loan_status: boolean;

    @Column({ type: 'smallint', nullable: true })
    owner: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    registration_place: string;

    @Column({ type: 'boolean', default: false })
    is_blacklisted: boolean;

    @Column({ type: 'boolean', default: false })
    is_rto_noc_issued: boolean;

    @Column({ type: 'boolean', default: false })
    is_party_peshi: boolean;

    @Column({ type: 'boolean', default: false })
    is_hypothecated: boolean;

    @Column({ type: 'boolean', default: false })
    is_converted: boolean;

    @Column({ type: 'boolean', default: false })
    is_migrated: boolean;

    @Column({ type: 'boolean', default: false })
    adapted_for_special_use: boolean;

    @Column({ type: 'smallint', default: 0 })
    criminal_cases: number;

    @Column({ type: 'smallint', default: 0 })
    civil_cases: number;

    @Column({ type: 'smallint', default: 0 })
    road_accidents: number;

    @Column({ type: 'smallint', default: 0 })
    compensation_cases: number;

    @Column({ type: 'smallint', default: 0 })
    other_cases: number;

    @Column({ type: 'text', nullable: true })
    staff_remarks: string;

    @Column({ type: 'int', nullable: true })
    updated_by_staff: number;

    @Column({ type: 'timestamptz', nullable: true })
    staff_updated_at: Date;

    // ✅ Relations
    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by_staff' })
    updatedByStaff: User;

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

    @ManyToOne(() => User)
    @JoinColumn({ name: 'inspection_assigned_to' })
    inspector: User;

    @ManyToOne(() => CarModel)
    @JoinColumn({ name: 'model_id' })
    model: CarModel;

    @ManyToOne(() => CarVariant)
    @JoinColumn({ name: 'variant_id' })
    variant: CarVariant;

    @ManyToOne(() => Pincode)
    @JoinColumn({ name: 'pincode_id' })
    pincode: Pincode;

    // customer relation
    @ManyToOne(() => Customer, customer => customer.usedCars)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @OneToMany(() => UsedCarCustomerPhoto, (photo) => photo.listing)
    photos: UsedCarCustomerPhoto[];

    @OneToMany(() => InspectionImage, image => image.used_car)
    inspectionImages: InspectionImage[];

    @OneToMany(() => CustomerWishlist, w => w.usedCar)
    wishlists: CustomerWishlist[];
}