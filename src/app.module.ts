import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './entity/user.entity';
import { ProductModule } from './product/product.module';
import { Product } from './entity/product.entity';
import { Order } from './entity/order.entity';
import { APP_GUARD } from '@nestjs/core';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.NODE_DB_TYPE as any,
      host: process.env.NODE_DB_HOST,
      port: parseInt(process.env.NODE_DB_PORT),
      password: process.env.NODE_DB_PASSWORD,
      username: process.env.NODE_DB_USERNAME,
      entities: [User, Product, Order],
      database: process.env.NODE_DB_NAME,
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    ProductModule,
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    OrderModule,
    // GatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
