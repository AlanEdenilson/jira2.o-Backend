import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

console.log(process.env.DB_PASSWORD);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Rabito503@',
      database: 'TiendaOnline',
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ProjectModule,
    TaskModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
