import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductsService, PAIR_DISCOUNT_ELIGIBLE, PAIR_DISCOUNT_RATE, MEMBER_DISCOUNT_RATE } from '../products/products.service';
import { CalculateOrderDto } from './dto/calculate-order.dto';

export interface ItemBreakdown {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  pairDiscount: number;
}

export interface OrderResult {
  items: ItemBreakdown[];
  totalBeforeDiscount: number;
  pairDiscountTotal: number;
  totalAfterPairDiscount: number;
  hasMember: boolean;
  memberDiscountRate: number;
  memberDiscountAmount: number;
  finalTotal: number;
}

@Injectable()
export class OrderService {
  constructor(private readonly productsService: ProductsService) {}

  calculate(dto: CalculateOrderDto): OrderResult {
    let totalBeforeDiscount = 0;
    let pairDiscountTotal = 0;
    const itemBreakdowns: ItemBreakdown[] = [];

    for (const { productId, quantity } of dto.items) {
      const product = this.productsService.findById(productId);
      if (!product) {
        throw new BadRequestException(`Unknown product: ${productId}`);
      }
      if (quantity <= 0) continue;

      const lineTotal = product.price * quantity;
      totalBeforeDiscount += lineTotal;

      let lineDiscount = 0;

      if ((PAIR_DISCOUNT_ELIGIBLE as readonly string[]).includes(productId)) {
        const pairs = Math.floor(quantity / 2);
        const pairSubtotal = pairs * product.price * 2;
        lineDiscount = this.roundTwo(pairSubtotal * PAIR_DISCOUNT_RATE);
      }

      pairDiscountTotal += lineDiscount;

      itemBreakdowns.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        lineTotal,
        pairDiscount: lineDiscount,
      });
    }

    const totalAfterPairDiscount = this.roundTwo(totalBeforeDiscount - pairDiscountTotal);

    const hasMember = Boolean(dto.memberCard && dto.memberCard.trim().length > 0);
    const memberDiscountAmount = hasMember
      ? this.roundTwo(totalAfterPairDiscount * MEMBER_DISCOUNT_RATE)
      : 0;

    const finalTotal = this.roundTwo(totalAfterPairDiscount - memberDiscountAmount);

    return {
      items: itemBreakdowns,
      totalBeforeDiscount,
      pairDiscountTotal,
      totalAfterPairDiscount,
      hasMember,
      memberDiscountRate: hasMember ? MEMBER_DISCOUNT_RATE : 0,
      memberDiscountAmount,
      finalTotal,
    };
  }

  /** Round to 2 decimal places to avoid floating-point issues */
  private roundTwo(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}
