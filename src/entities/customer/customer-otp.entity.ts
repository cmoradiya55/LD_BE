import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerOtpType } from '@common/enums/customer.enum';

@Entity('customer_otps')
export class CustomerOtp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id', nullable: true })
    customer_id: number;

    // OTP Details
    @Column({ name: 'identifier', type: 'varchar', length: 255 })
    identifier: string;

    @Column({ name: 'otp', length: 6 })
    otp: string;

    @Column({ name: 'otp_type', type: 'smallint' })
    otp_type: CustomerOtpType;

    // Expiry & Attempts
    @Column({ name: 'expires_at', type: 'timestamptz' })
    expires_at: Date;

    @Column({ name: 'is_verified', type: 'boolean', default: false })
    is_verified: boolean;

    @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
    verified_at: Date;

    @Column({ name: 'attempts', type: 'int', default: 0 })
    attempts: number;

    @Column({ name: 'max_attempts', type: 'int', default: 3 })
    max_attempts: number;

    // Tracking
    @Column({ name: 'request_ip', type: 'inet', nullable: true })
    request_ip: string;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    user_agent: string;

    // Timestamps
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at: Date;

    // Relations
    @ManyToOne(() => Customer, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;
}