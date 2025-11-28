import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('pincodes')
export class Pincode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10 })
    pincode: string;

    @Column({ type: 'int', nullable: true })
    city_id: number | null;

    @Column({ type: 'numeric', nullable: true })
    latitude: number | null;

    @Column({ type: 'numeric', nullable: true })
    longitude: number | null;

    /** RELATION TO CITY */
    @ManyToOne(() => City)
    @JoinColumn({ name: 'city_id' })
    city: City;
}
