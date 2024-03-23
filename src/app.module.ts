import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';
import { PrismaClientValidationErrorFilter } from './prisma-client-validation-error.filter';
import { NotFoundExceptionFilter } from './not-found-exception.filter';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { resolve } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 40000,
        limit: 80,
      },
    ]),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          maxFiles: 10,
          maxsize: 10000000,
          dirname: resolve('logs'),
          filename: 'info.log',
          level: 'info',
        }),
        new winston.transports.File({
          maxFiles: 10,
          maxsize: 10000000,
          dirname: resolve('logs'),
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    CacheModule.register({ isGlobal: true }),
    PrismaModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientValidationErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
