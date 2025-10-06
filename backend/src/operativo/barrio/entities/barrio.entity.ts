import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ruta } from 'src/operativo/ruta/entities/ruta.entity'; 

@Entity('barrios')
export class Barrio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Polygon', srid: 4326, nullable: true })
  geom: string;

  @OneToMany(() => Ruta, ruta => ruta.barrio)
  rutas: Ruta[];
}
