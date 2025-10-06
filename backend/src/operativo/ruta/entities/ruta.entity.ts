import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Recorrido } from 'src/operativo/recorrido/entities/recorrido.entity'; 
import { Barrio } from 'src/operativo/barrio/entities/barrio.entity';

@Entity('rutas')
export class Ruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'float' })
  longitud: number;

  @Column({ length: 10, nullable: true })
  color_hex: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'geometry', spatialFeatureType: 'LineString', srid: 4326, nullable: true })
  shape: string;

  @ManyToOne(() => Barrio, barrio => barrio.rutas)
  barrio: Barrio;

  @OneToMany(() => Recorrido, recorrido => recorrido.ruta)
  recorridos: Recorrido[];
}
