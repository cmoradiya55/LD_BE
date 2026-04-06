import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { CustomerDeviceType } from '@common/enums/customer.enum';
import { User } from './user.entity';

@Entity('user_refresh_tokens')
export class UserRefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    user_id: number;

    // Token
    @Column({ name: 'refresh_token', length: 500 })
    refresh_token: string;

    @Column({ name: 'refresh_token_hash', length: 255 })
    refresh_token_hash: string;

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
    @ManyToOne(() => User, user => user.refreshTokens)
    @JoinColumn({ name: 'user_id' })
    user: User;
}