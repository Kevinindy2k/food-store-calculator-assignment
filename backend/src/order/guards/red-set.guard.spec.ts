import { ExecutionContext, HttpException } from '@nestjs/common';
import { RedSetGuard } from './red-set.guard';

function createMockContext(body: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ body }),
    }),
  } as unknown as ExecutionContext;
}

describe('RedSetGuard', () => {
  let guard: RedSetGuard;

  beforeEach(() => {
    guard = new RedSetGuard();
  });

  it('should allow when no red set in order', () => {
    const ctx = createMockContext({
      items: [{ productId: 'blue', quantity: 1 }],
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow first red set order', () => {
    const ctx = createMockContext({
      items: [{ productId: 'red', quantity: 1 }],
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should block second red set order within 1 hour', () => {
    const ctx = createMockContext({
      items: [{ productId: 'red', quantity: 1 }],
    });
    guard.canActivate(ctx); // first order

    expect(() => guard.canActivate(ctx)).toThrow(HttpException);
  });

  it('should allow red set order after 1 hour', () => {
    const ctx = createMockContext({
      items: [{ productId: 'red', quantity: 1 }],
    });

    const realNow = Date.now;
    const pastTime = Date.now() - 3600001; // just over 1 hour ago
    Date.now = jest.fn(() => pastTime);
    guard.canActivate(ctx);

    Date.now = realNow;
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow after reset', () => {
    const ctx = createMockContext({
      items: [{ productId: 'red', quantity: 1 }],
    });
    guard.canActivate(ctx);
    expect(() => guard.canActivate(ctx)).toThrow(HttpException);

    guard.reset();
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
