import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Guard that enforces the Red set ordering restriction:
 * only one customer can order a Red set within a 1-hour window.
 */
@Injectable()
export class RedSetGuard implements CanActivate {
  private lastRedSetOrderTime: number | null = null;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { items } = request.body ?? {};

    if (!Array.isArray(items)) return true;

    const hasRed = items.some(
      (item: { productId: string; quantity: number }) =>
        item.productId === 'red' && item.quantity > 0,
    );

    if (!hasRed) return true;

    if (this.lastRedSetOrderTime !== null) {
      const elapsed = Date.now() - this.lastRedSetOrderTime;
      if (elapsed < ONE_HOUR_MS) {
        const minutesLeft = Math.ceil((ONE_HOUR_MS - elapsed) / 60000);
        throw new HttpException(
          `Red set is currently unavailable. Only one order per hour is allowed. Please try again in ~${minutesLeft} minute(s).`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    // Record this order timestamp; will be persisted after successful calculate
    this.lastRedSetOrderTime = Date.now();
    return true;
  }

  /** Reset the limiter (useful for testing). */
  reset(): void {
    this.lastRedSetOrderTime = null;
  }
}
