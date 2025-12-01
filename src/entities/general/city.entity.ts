import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Pincode } from './pincode.entity';

@Entity('cities')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    state_name: string;

    @Column({ type: 'varchar', length: 150 })
    city_name: string;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
    updated_at: Date;

    @OneToMany(() => Pincode, p => p.city)
    pincodes: Pincode[];
}
