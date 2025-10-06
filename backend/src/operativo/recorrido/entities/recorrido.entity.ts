import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Vehiculo } from 'src/operativo/vehiculo/entities/vehiculo.entity';
import { Ruta } from 'src/operativo/ruta/entities/ruta.entity';
import { Posicion } from 'src/operativo/posicion/entities/posicion.entity';

@Entity('recorridos')
export class Recorrido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fin: Date;

  @Column({ length: 20, default: 'activo' })
  estado: string;

  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.recorridos)
  vehiculo: Vehiculo;

  @ManyToOne(() => Ruta, ruta => ruta.recorridos)
  ruta: Ruta;

  @OneToMany(() => Posicion, posicion => posicion.recorrido)
  posiciones: Posicion[];
}
