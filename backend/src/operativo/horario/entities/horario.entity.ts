import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Ruta } from 'src/operativo/ruta/entities/ruta.entity';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'int' })
  ventana_min: number;

  @Column({ length: 20 })
  dia_semana: string;

  @ManyToOne(() => Ruta, ruta => ruta.id)
  ruta: Ruta;
}
