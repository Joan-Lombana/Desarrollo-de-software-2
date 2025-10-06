import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Usuario } from 'src/autenticacion/usuario/entities/usuario.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, default: 'activo' })
  estado: string;

  @Column({ type: 'jsonb', nullable: true })
  personalizacion: Record<string, any>;

  @OneToOne(() => Usuario, usuario => usuario.perfil)
  usuario: Usuario;
}

