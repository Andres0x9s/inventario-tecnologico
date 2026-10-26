
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('equipos')
export class Equipo {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  codigoInventario!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 50 })
  tipo!: string;

  @Column({ type: 'varchar', length: 60 })
  marca!: string;

  @Column({ type: 'varchar', length: 100 })
  modelo!: string;

  @Column({ type: 'varchar', length: 100 })
  ubicacion!: string;

  @Column({
    type: 'enum',
    enum: ['Disponible', 'En uso', 'Mantención', 'Baja'],
  })
  estado!: 'Disponible' | 'En uso' | 'Mantención' | 'Baja';

  @Column({ type: 'date' })
  fechaAdquisicion!: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;
}

