import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TagEntity } from './tag/entity/tag.entity';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';
import { ArticleEntity } from './article/entity/article.entity';
import { CommentEntity } from './article/entity/comment.entity';

@Module({
  imports: [
    TagModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (сonfigService: ConfigService) => ({
        type: 'postgres',
        host: сonfigService.get('DB_HOST'),
        port: +сonfigService.get('DB_PORT'),
        username: сonfigService.get('DB_USERNAME'),
        password: сonfigService.get('DB_PASSWORD'),
        database: сonfigService.get('DB_NAME'),
        synchronize: true,
        entities: [TagEntity, UserEntity, ArticleEntity, CommentEntity],
      }),
      inject: [ConfigService],
    }),
    ArticleModule,
    UserModule,
  ],
})
export class AppModule {}
