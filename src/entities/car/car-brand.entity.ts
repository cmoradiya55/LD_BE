import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('brands')
export class CarBrand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    display_name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    logo_url: string | null;

    @Column({ type: 'smallint' })
    operation_start_year: number;

    @Column({ type: 'smallint', nullable: true })
    operation_end_year: number | null;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'boolean', default: false })
    is_priority: boolean;

    @Column({ type: 'smallint', default: 0 })
    priority_order: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
