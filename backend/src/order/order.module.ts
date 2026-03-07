import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductsModule } from '../products/products.module';
import { RedSetGuard } from './guards/red-set.guard';

@Module({
  imports: [ProductsModule],
  controllers: [OrderController],
  providers: [OrderService, RedSetGuard],
})
export class OrderModule {}
