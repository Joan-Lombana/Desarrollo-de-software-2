import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { OperativoModule } from './operativo/operativo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApilucioModule } from 'rutas-service/src/apilucio/apilucio.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ecoruta-postgis',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'ecoruta',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AutenticacionModule,
    OperativoModule,
    ApilucioModule, // 👈 ¡Este es el que falta!
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}