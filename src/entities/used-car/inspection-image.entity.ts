// =============================================
// entities/inspection-image.entity.ts
// =============================================

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, UpdateDateColumn } from 'typeorm';
import { UsedCar } from './used-car.entity';

@Entity('inspection_images')
@Index('idx_inspection_images_lookup', ['vehicle_id', 'is_active', 'image_type', 'image_subtype', 'sort_order'])
export class InspectionImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    vehicle_id: number;

    @Column({ type: 'int' })
    inspector_id: number;

    @Column({ type: 'smallint' })
    image_type: number;

    @Column({ type: 'smallint' })
    image_subtype: number;

    @Column({ type: 'varchar', length: 500 })
    image_url: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @Column({ type: 'smallint', nullable: true })
    condition_rating: number;

    @Column({ type: 'boolean', default: false })
    has_damage: boolean;

    @Column({ type: 'smallint', default: 0 })
    sort_order: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => UsedCar, usedCar => usedCar.inspectionImages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vehicle_id' })
    used_car: UsedCar;

    // @ManyToOne(() => Inspector, inspector => inspector.images)
    // @JoinColumn({ name: 'inspector_id' })
    // inspector: Inspector;
}