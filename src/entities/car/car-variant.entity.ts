import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity('variants')
export class CarVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  model_id: number;

  // Reserved keyword, must specify name
  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  display_name: string;

  @Column({ type: 'varchar', length: 150 })
  slug: string;

  @Column({ type: 'smallint' })
  model_year: number;

  @Column({ type: 'smallint' })
  fuel_type: number;

  @Column({ type: 'smallint', nullable: true })
  engine_displacement_cc: number | null;

  @Column({ type: 'smallint', nullable: true })
  cylinders: number | null;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  max_power_ps: number | null;

  @Column({ type: 'int', nullable: true })
  max_power_rpm: number | null;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  max_torque_nm: number | null;

  @Column({ type: 'int', nullable: true })
  max_torque_rpm: number | null;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  fuel_tank_litres: number | null;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  mileage_kmpl: number | null;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  battery_capacity_kwh: number | null;

  @Column({ type: 'smallint', nullable: true })
  electric_range_km: number | null;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  electric_motor_power_kw: number | null;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  electric_motor_torque_nm: number | null;

  @Column({ type: 'smallint' })
  transmission_type: number;

  @Column({ type: 'smallint', nullable: true })
  num_gears: number | null;

  @Column({ type: 'smallint', nullable: true })
  boot_space_litres: number | null;

  @Column({ type: 'smallint' })
  seating_capacity: number;

  @Column({ type: 'smallint' })
  ground_clearance_mm: number;

  @Column({ type: 'smallint', nullable: true })
  kerb_weight_kg: number | null;

  @Column({ type: 'varchar', length: 50 })
  front_tyre_size: string;

  @Column({ type: 'varchar', length: 50 })
  rear_tyre_size: string;

  @Column({ type: 'smallint' })
  wheel_type: number;

  @Column({ type: 'smallint', nullable: true })
  front_brake_type: number | null;

  @Column({ type: 'smallint', nullable: true })
  rear_brake_type: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  front_suspension: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rear_suspension: string | null;

  @Column({ type: 'smallint' })
  steering_type: number;

  @Column({ type: 'bigint', nullable: true })
  ex_showroom_price: string | null; // bigint → use string in JS

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  /** FK RELATION */
  @ManyToOne(() => CarModel)
  @JoinColumn({ name: 'model_id' })
  model: CarModel;
}
