import { Module } from '@nestjs/common';
import { RecorridoService } from './recorrido.service';
import { RecorridoController } from './recorrido.controller';

@Module({
  controllers: [RecorridoController],
  providers: [RecorridoService],
})
export class RecorridoModule {}
