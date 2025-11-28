import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { CarBrand } from './car-brand.entity';

@Entity('models')
export class CarModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    brand_id: number;

    // "name" must be specially handled because it's a reserved JS keyword
    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 150 })
    display_name: string;

    @Column({ type: 'varchar', length: 150 })
    slug: string;

    @Column({ type: 'smallint' })
    body_type: number;

    @Column({ type: 'smallint', nullable: true })
    segment: number | null;

    @Column({ type: 'smallint', default: 1 })
    transportation_category: number;

    @Column({ type: 'smallint' })
    production_start_year: number;

    @Column({ type: 'smallint', nullable: true })
    production_end_year: number | null;

    @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
    global_ncap_rating: number | null;

    @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
    bharat_ncap_rating: number | null;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    /** Foreign Key Relation */
    @ManyToOne(() => CarBrand)
    @JoinColumn({ name: 'brand_id' })
    brand: CarBrand;
}
