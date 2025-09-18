import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrmConfig from './config/orm.config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './global/interceptors/response.interceptor';
import { ValidationPipe } from './global/validation.pipe';
import { CategoriesModule } from './categories/categories.module';
import { ResourcesModule } from './resources/resources.module';
import { GlobalHttpExceptionFilter } from './global/global.exception';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './global/guards/access-token.guard';
import { PermissionGuard } from './global/guards/permission.guard';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forRoot(OrmConfig),
    AuthModule,
    CategoriesModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    AppService,
  ],
})
export class AppModule {}
