import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { CustomerRefreshToken } from './customer-refresh-token.entity';
import { CustomerFcmToken } from './customer-fcm-token.entity';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    // Personal Info
    @Column({ name: 'full_name', length: 255, nullable: true })
    full_name: string;

    // Mobile (Primary Authentication)
    @Column({ name: 'mobile_country_code', type: 'smallint' })
    mobile_country_code: number;

    @Column({ name: 'mobile_no', type: 'bigint' })
    mobile_no: number;

    @Column({ name: 'is_mobile_verified', type: 'boolean', default: false })
    is_mobile_verified: boolean;

    @Column({ name: 'mobile_verified_at', type: 'timestamptz', nullable: true })
    mobile_verified_at: Date;

    // Email (Optional)
    @Column({ name: 'email', length: 255, nullable: true })
    email: string;

    @Column({ name: 'is_email_verified', type: 'boolean', default: false })
    is_email_verified: boolean;

    @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
    email_verified_at: Date;

    // Profile
    @Column({ name: 'profile_image', type: 'text', nullable: true })
    profile_image: string;

    // Settings
    @Column({ name: 'notification_enabled', type: 'boolean', default: true })
    notification_enabled: boolean;

    // Security
    @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
    last_login_at: Date;

    @Column({ name: 'last_login_ip', type: 'inet', nullable: true })
    last_login_ip: string;

    @Column({ name: 'login_attempts', type: 'smallint', default: 0 })
    login_attempts: number;

    @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
    locked_until: Date;

    // Status
    @Column({ name: 'is_active', type: 'boolean', default: true })
    is_active: boolean;

    @Column({ name: 'is_blocked', type: 'boolean', default: false })
    is_blocked: boolean;

    @Column({ name: 'city_id', type: 'int', nullable: true })
    city_id: number | null;

    @Column({ name: 'blocked_reason', type: 'text', nullable: true })
    blocked_reason: string | null;

    @Column({ name: 'account_delete_reason', type: 'text', nullable: true })
    account_delete_reason: string | null;

    @Column({ name: 'blocked_at', type: 'timestamptz', nullable: true })
    blocked_at: Date | null;

    // Timestamps
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
    updated_at: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deleted_at: Date;

    // Relations
    @OneToMany(() => CustomerRefreshToken, token => token.customer)
    refreshTokens: CustomerRefreshToken[];

    @OneToMany(() => CustomerFcmToken, token => token.customer)
    fcmTokens: CustomerFcmToken[];
}