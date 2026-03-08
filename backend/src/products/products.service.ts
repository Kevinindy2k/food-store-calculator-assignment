import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';

/** IDs of products eligible for the 5% pair discount */
export const PAIR_DISCOUNT_ELIGIBLE = ['orange', 'pink', 'green'] as const;

/** Pair discount rate (5%) */
export const PAIR_DISCOUNT_RATE = 0.05;

/** Member card discount rate (10%) */
export const MEMBER_DISCOUNT_RATE = 0.1;

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    { id: 'red',    name: 'Red set',    price: 50,  color: '#e74c3c' },
    { id: 'green',  name: 'Green set',  price: 40,  color: '#2ecc71' },
    { id: 'blue',   name: 'Blue set',   price: 30,  color: '#3498db' },
    { id: 'yellow', name: 'Yellow set', price: 50,  color: '#f1c40f' },
    { id: 'pink',   name: 'Pink set',   price: 80,  color: '#e91e8a' },
    { id: 'purple', name: 'Purple set', price: 90,  color: '#9b59b6' },
    { id: 'orange', name: 'Orange set', price: 120, color: '#e67e22' },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
