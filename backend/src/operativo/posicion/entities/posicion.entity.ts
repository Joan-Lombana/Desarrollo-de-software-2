import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Recorrido } from 'src/operativo/recorrido/entities/recorrido.entity'; 

@Entity('posiciones')
export class Posicion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  geom: string;

  @Column({ type: 'timestamp' })
  capturado_ts: Date;

  @ManyToOne(() => Recorrido, recorrido => recorrido.posiciones)
  recorrido: Recorrido;
}
