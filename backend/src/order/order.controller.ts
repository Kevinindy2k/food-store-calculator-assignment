import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService, OrderResult } from './order.service';
import { CalculateOrderDto } from './dto/calculate-order.dto';
import { RedSetGuard } from './guards/red-set.guard';

@Controller('calculate')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(RedSetGuard)
  calculate(@Body() dto: CalculateOrderDto): OrderResult {
    return this.orderService.calculate(dto);
  }
}
