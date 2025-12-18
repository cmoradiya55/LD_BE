import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { User } from '@entity/user/user.entity';
import { Pincode } from '@entity/general/pincode.entity';
import { City } from '@entity/general/city.entity';

@Entity({ name: 'inspection_centre' })
export class InspectionCentre {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'text' })
    landmark: string;

    @Column({ name: 'pincode_id', type: 'int' })
    pincode_id: number;

    @Column({ name: 'city_id', type: 'int' })
    city_id: number;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at: Date;

    @Column({ name: 'created_by', type: 'int' })
    created_by: number;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
    updated_at: Date;

    @Column({ name: 'updated_by', type: 'int', nullable: true })
    updated_by: number;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deleted_at: Date;

    @Column({ name: 'deleted_by', type: 'int', nullable: true })
    deleted_by: number;

    /* ===================== RELATIONS ===================== */

    @ManyToOne(() => City)
    @JoinColumn({ name: 'city_id' })
    city: City;

    @ManyToOne(() => Pincode)
    @JoinColumn({ name: 'pincode_id' })
    pincode: Pincode;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    created_by_user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by' })
    updated_by_user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'deleted_by' })
    deleted_by_user: User;
}
