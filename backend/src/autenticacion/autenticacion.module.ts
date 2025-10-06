import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { PerfilModule } from './perfil/perfil.module';
import { RolModule } from './rol/rol.module';
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioService } from './usuario/usuario.service';
import { Usuario } from './usuario/entities/usuario.entity';
import { Rol } from './rol/entities/rol.entity';
import { Perfil } from './perfil/entities/perfil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol, Perfil])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class AutenticacionModule {}
