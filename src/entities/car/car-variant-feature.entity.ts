import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Feature } from '../general/feature.entity';
import { CarVariant } from './car-variant.entity';

@Entity('variant_features')
export class CarVariantFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  variant_id: number;

  @Column({ type: 'int' })
  feature_id: number;

  @Column({ type: 'varchar', length: 255 })
  feature_value: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  /** RELATIONS */

  @ManyToOne(() => CarVariant, (variant) => variant.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: CarVariant;

  @ManyToOne(() => Feature, (feature) => feature.id)
  @JoinColumn({ name: 'feature_id' })
  feature: Feature;
}
