import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('colors')
export class Color {
    @PrimaryGeneratedColumn({ type: 'smallint' })
    id: number;

    // Reserved keyword, must map explicitly
    @Column({ name: 'name', type: 'varchar', length: 30 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    display_name: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
}
