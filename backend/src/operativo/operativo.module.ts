import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ruta } from './ruta/entities/ruta.entity';
import { Barrio } from './barrio/entities/barrio.entity';
import { Vehiculo } from './vehiculo/entities/vehiculo.entity';
import { Recorrido } from './recorrido/entities/recorrido.entity';
import { Posicion } from './posicion/entities/posicion.entity';
import { Horario } from './horario/entities/horario.entity';
import { RutaController } from './ruta/ruta.controller';
import { RutaService } from './ruta/ruta.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ruta,Barrio,Vehiculo,Recorrido,Posicion,Horario,])],
  controllers: [RutaController],
  providers: [RutaService],
  exports: [TypeOrmModule]
 
})
export class OperativoModule {}
