import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ProductsModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
