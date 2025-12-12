import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerDeviceType } from '@common/enums/customer.enum';

@Entity('customer_fcm_tokens')
export class CustomerFcmToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customer_id: number;

    // Token & Device Info
    @Column({ name: 'fcm_token', type: 'text' })
    fcm_token: string;

    @Column({ name: 'device_id', length: 255, nullable: true })
    device_id: string;

    @Column({ name: 'device_type', type: 'smallint' })
    device_type: CustomerDeviceType;

    @Column({ name: 'device_name', length: 255, nullable: true })
    device_name: string;

    @Column({ name: 'device_os', length: 100, nullable: true })
    device_os: string;

    @Column({ name: 'app_version', length: 50, nullable: true })
    app_version: string;

    // Status
    @Column({ name: 'is_active', type: 'boolean', default: true })
    is_active: boolean;

    @Column({ name: 'last_used_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    last_used_at: Date;

    // Timestamps
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
    updated_at: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deleted_at: Date;

    // Relations
    @ManyToOne(() => Customer, customer => customer.fcmTokens)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;
}