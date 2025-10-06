import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { OperativoModule } from './operativo/operativo.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
      host: 'localhost', // o el nombre del contenedor, ej: 'ecoruta-postgis'
      port: 5434,
      username: 'postgres',
      password: '123456',
      database: 'ecoruta',
      autoLoadEntities: true,
      synchronize: true, // 👈 crea automáticamente las tablas (solo en desarrollo)
    }),
    AutenticacionModule, OperativoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
