import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { SongsController } from './songs/songs.controller';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PlayListModule } from './playlists/playlist.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { typeOrmAsyncConfig } from '../db/data-source';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.development.env', '.production.env'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    // TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    PlayListModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSoruce: DataSource) {
    console.log('database => ', dataSoruce.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes({path: 'songs', method: 'RequestMethod.POST'});

    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
