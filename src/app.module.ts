import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InternshipsModule } from './internships/internships.module';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Load .env globally across all modules
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to PostgreSQL
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,   // auto-registers entities
        synchronize: true,        // auto-creates tables in dev (turn off in production)
      }),
    }),

    // Rate limiting — protects auth routes from brute force
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),

    UsersModule,

    InternshipsModule,

    ApplicationsModule,

    AuthModule,

    MailModule,

    AdminModule,    

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
