import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recorrido } from 'src/operativo/recorrido/entities/recorrido.entity'; 

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero_vehiculo: string;

  @OneToMany(() => Recorrido, recorrido => recorrido.vehiculo)
  recorridos: Recorrido[];
}
