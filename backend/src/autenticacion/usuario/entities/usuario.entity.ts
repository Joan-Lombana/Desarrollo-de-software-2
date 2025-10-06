import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Perfil } from 'src/autenticacion/perfil/entities/perfil.entity';
import { Rol } from 'src/autenticacion/rol/entities/rol.entity'; 

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column({ length: 15, nullable: true })
  numero_celular: string;

  @OneToOne(() => Perfil, perfil => perfil.usuario, { cascade: true })
  @JoinColumn()
  perfil: Perfil;

  @ManyToOne(() => Rol, rol => rol.usuarios)
  rol: Rol;
}

