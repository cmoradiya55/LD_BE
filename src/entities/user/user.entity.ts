// entities/user.entity.ts
import { City } from '@entity/general/city.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Check,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';
import { UserRefreshToken } from './user-refresh-token.entity';
import { InspectionCentre } from '@entity/inapection-centre/inspection-centre.entity';

@Entity('users')
@Check('chk_country_code', 'country_code > 0')
@Check('chk_mobile_number', 'mobile_number > 0')
@Index('idx_users_email_unique', ['email'], { unique: true, where: 'deleted_at IS NULL' })
@Index('idx_users_mobile_unique', ['country_code', 'mobile_number'], { unique: true, where: 'deleted_at IS NULL' })
@Index('idx_users_role', ['role'], { where: 'deleted_at IS NULL' })
@Index('idx_users_manager_id', ['manager_id'], { where: 'deleted_at IS NULL' })
@Index('idx_users_is_active', ['is_active'], { where: 'deleted_at IS NULL' })
@Index('idx_users_created_at', ['created_at'])
@Index('idx_users_role_active', ['role', 'is_active'], { where: 'deleted_at IS NULL' })
@Index('idx_users_manager_active', ['manager_id', 'is_active'], { where: 'deleted_at IS NULL' })
@Index('idx_users_deleted_at', ['deleted_at'], { where: 'deleted_at IS NOT NULL' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'smallint' })
    country_code: number;

    @Column({ type: 'bigint' })
    mobile_number: number;

    @Column({ type: 'int', default: 0 })
    jwt_version: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'int', nullable: true })
    inspection_centre_id: number | null;

    @Column({ type: 'varchar', length: 6, nullable: true })
    otp: string | null;

    @Column({ type: 'smallint', nullable: true })
    otp_type: number | null;

    @Column({ type: 'timestamptz', nullable: true })
    otp_expires_at: Date | null;

    @ManyToOne(() => InspectionCentre)
    @JoinColumn({ name: 'inspection_centre_id' })
    inspectionCentre: InspectionCentre;

    @Column({ type: 'text', nullable: true })
    fcm_token: string | null;

    @Column({ type: 'smallint' })
    role: number;

    @Column({ type: 'int', nullable: true })
    manager_id: number | null;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'manager_id' })
    manager: User;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'boolean', default: true })
    is_mobile_verified: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    mobile_verified_at: Date | null;

    @Column({ type: 'boolean', default: true })
    is_email_verified: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    email_verified_at: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    selfie_image: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    aadhar_number: string | null;

    @Column({ type: 'text', nullable: true })
    aadhar_front_image: string | null;

    @Column({ type: 'text', nullable: true })
    aadhar_back_image: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    pan_number: string | null;

    @Column({ type: 'text', nullable: true })
    pan_image: string | null;

    @Column({ type: 'smallint', default: 1 })
    document_status: number;

    @Column({ type: 'text', nullable: true })
    reject_reason: string | null;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'int' })
    created_by: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by' })
    createdByUser: User;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
    updated_at: Date;

    @Column({ type: 'int', nullable: true })
    updated_by: number | null;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'updated_by' })
    updatedByUser: User;

    @Column({ type: 'timestamptz', nullable: true })
    deleted_at: Date | null;

    @Column({ type: 'int', nullable: true })
    deleted_by: number | null;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'deleted_by' })
    deletedByUser: User;

    // Relations
    @OneToMany(() => UserRefreshToken, token => token.user)
    refreshTokens: UserRefreshToken[];

    // Helper methods
    isAdmin(): boolean {
        return this.role === 1;
    }

    isManager(): boolean {
        return this.role === 2;
    }

    isInspector(): boolean {
        return this.role === 3;
    }

    isStaff(): boolean {
        return this.role === 4;
    }

    isDeleted(): boolean {
        return this.deleted_at !== null;
    }

    getFullMobile(): string {
        return `+${this.country_code}${this.mobile_number}`;
    }
}