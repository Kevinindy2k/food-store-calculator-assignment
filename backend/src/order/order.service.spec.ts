import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { ProductsService } from '../products/products.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, ProductsService],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  // ── Basic pricing ──────────────────────────

  it('should calculate single item with no discount', () => {
    const result = service.calculate({
      items: [{ productId: 'blue', quantity: 1 }],
    });
    expect(result.totalBeforeDiscount).toBe(30);
    expect(result.pairDiscountTotal).toBe(0);
    expect(result.finalTotal).toBe(30);
  });

  it('should calculate multiple items with no pair-eligible', () => {
    const result = service.calculate({
      items: [
        { productId: 'red', quantity: 1 },
        { productId: 'blue', quantity: 2 },
        { productId: 'yellow', quantity: 1 },
      ],
    });
    // 50 + 60 + 50 = 160
    expect(result.totalBeforeDiscount).toBe(160);
    expect(result.pairDiscountTotal).toBe(0);
    expect(result.finalTotal).toBe(160);
  });

  // ── Pair discount (5%) ─────────────────────

  it('should apply 5% discount on Orange x2 pair', () => {
    const result = service.calculate({
      items: [{ productId: 'orange', quantity: 2 }],
    });
    // (120+120) = 240, 5% of 240 = 12
    expect(result.totalBeforeDiscount).toBe(240);
    expect(result.pairDiscountTotal).toBe(12);
    expect(result.finalTotal).toBe(228);
  });

  it('should apply 5% discount on Pink x4 (two pairs)', () => {
    const result = service.calculate({
      items: [{ productId: 'pink', quantity: 4 }],
    });
    // 2 pairs × (80+80) = 320, 5% of 320 = 16
    expect(result.totalBeforeDiscount).toBe(320);
    expect(result.pairDiscountTotal).toBe(16);
    expect(result.finalTotal).toBe(304);
  });

  it('should apply 5% discount on Green x3 (one pair + one full price)', () => {
    const result = service.calculate({
      items: [{ productId: 'green', quantity: 3 }],
    });
    // 3×40 = 120; pair discount = 5% of 80 = 4
    expect(result.totalBeforeDiscount).toBe(120);
    expect(result.pairDiscountTotal).toBe(4);
    expect(result.finalTotal).toBe(116);
  });

  it('should not apply pair discount on Green x1', () => {
    const result = service.calculate({
      items: [{ productId: 'green', quantity: 1 }],
    });
    expect(result.totalBeforeDiscount).toBe(40);
    expect(result.pairDiscountTotal).toBe(0);
    expect(result.finalTotal).toBe(40);
  });

  it('should apply pair discount on Orange x5 (two pairs + one full price)', () => {
    const result = service.calculate({
      items: [{ productId: 'orange', quantity: 5 }],
    });
    // 5×120 = 600; 2 pairs = 480; discount = 5% of 480 = 24
    expect(result.totalBeforeDiscount).toBe(600);
    expect(result.pairDiscountTotal).toBe(24);
    expect(result.finalTotal).toBe(576);
  });

  // ── Member card discount (10%) ─────────────

  it('should apply 10% member discount on total', () => {
    const result = service.calculate({
      items: [{ productId: 'blue', quantity: 2 }],
      memberCard: 'MEMBER001',
    });
    // 60, no pair discount, 10% = 6
    expect(result.totalBeforeDiscount).toBe(60);
    expect(result.hasMember).toBe(true);
    expect(result.memberDiscountAmount).toBe(6);
    expect(result.finalTotal).toBe(54);
  });

  it('should apply member discount after pair discount', () => {
    const result = service.calculate({
      items: [{ productId: 'orange', quantity: 2 }],
      memberCard: 'CARD999',
    });
    // 240 - 12 (pair) = 228; 10% of 228 = 22.8
    expect(result.totalBeforeDiscount).toBe(240);
    expect(result.pairDiscountTotal).toBe(12);
    expect(result.totalAfterPairDiscount).toBe(228);
    expect(result.memberDiscountAmount).toBe(22.8);
    expect(result.finalTotal).toBe(205.2);
  });

  it('should treat empty member card as no member', () => {
    const result = service.calculate({
      items: [{ productId: 'blue', quantity: 1 }],
      memberCard: '   ',
    });
    expect(result.hasMember).toBe(false);
    expect(result.memberDiscountAmount).toBe(0);
  });

  it('should treat undefined member card as no member', () => {
    const result = service.calculate({
      items: [{ productId: 'blue', quantity: 1 }],
    });
    expect(result.hasMember).toBe(false);
  });

  // ── Edge cases ─────────────────────────────

  it('should ignore zero quantity items', () => {
    const result = service.calculate({
      items: [{ productId: 'red', quantity: 0 }],
    });
    expect(result.totalBeforeDiscount).toBe(0);
    expect(result.finalTotal).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('should throw for unknown product', () => {
    expect(() =>
      service.calculate({ items: [{ productId: 'silver', quantity: 1 }] }),
    ).toThrow('Unknown product: silver');
  });

  it('should handle mixed order with multiple pair-eligible items', () => {
    const result = service.calculate({
      items: [
        { productId: 'orange', quantity: 2 }, // pair discount 12
        { productId: 'pink', quantity: 3 },   // pair discount 8
        { productId: 'green', quantity: 1 },  // no pair
        { productId: 'blue', quantity: 1 },   // no pair
      ],
    });
    // orange: 240, pink: 240, green: 40, blue: 30 = 550
    expect(result.totalBeforeDiscount).toBe(550);
    // pair discounts: 12 + 8 = 20
    expect(result.pairDiscountTotal).toBe(20);
    expect(result.finalTotal).toBe(530);
  });
});
