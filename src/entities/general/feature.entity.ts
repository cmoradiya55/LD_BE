import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('features')
export class Feature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'smallint' })
    category: number;

    // Reserved keyword → must map explicitly
    @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 150 })
    display_name: string;

    @Column({ type: 'smallint', default: 1 })
    value_type: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    unit: string | null;

    @Column({ type: 'text', nullable: true })
    possible_values: string | null;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
}
