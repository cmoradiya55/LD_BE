import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerDeviceType } from '@common/enums/customer.enum';

@Entity('customer_refresh_tokens')
export class CustomerRefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customer_id: number;

    // Token
    @Column({ name: 'refresh_token', length: 500 })
    refresh_token: string;

    @Column({ name: 'refresh_token_hash', length: 255 })
    refresh_token_hash: string;

    // Device Info
    @Column({ name: 'device_id', length: 255 })
    device_id: string;

    @Column({ name: 'device_type', type: 'smallint' })
    device_type: CustomerDeviceType;

    @Column({ name: 'device_name', length: 255, nullable: true })
    device_name: string;

    // Security
    @Column({ name: 'ip_address', type: 'inet', nullable: true })
    ip_address: string;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    user_agent: string;

    // Expiry
    @Column({ name: 'expires_at', type: 'timestamptz' })
    expires_at: Date;

    @Column({ name: 'last_used_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    last_used_at: Date;

    // Status
    @Column({ name: 'is_revoked', type: 'boolean', default: false })
    is_revoked: boolean;

    @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
    revoked_at: Date;

    @Column({ name: 'revoked_reason', length: 100, nullable: true })
    revoked_reason: string;

    // Timestamps
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deleted_at: Date;

    // Relations
    @ManyToOne(() => Customer, customer => customer.refreshTokens)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;
}