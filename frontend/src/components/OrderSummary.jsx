import React from "react";

/**
 * Displays the calculation breakdown after hitting "Calculate".
 */
export default function OrderSummary({ result }) {
  if (!result) return null;

  const {
    items,
    totalBeforeDiscount,
    pairDiscountTotal,
    hasMember,
    memberDiscountAmount,
    finalTotal,
  } = result;

  return (
    <div className="summary">
      <h2>Order Summary</h2>

      {/* Item breakdown */}
      <div className="summary-items">
        {items.map((item) => (
          <div key={item.productId}>
            <div className="item-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{item.lineTotal.toFixed(2)} THB</span>
            </div>
            {item.pairDiscount > 0 && (
              <div className="item-discount">
                Pair discount (5%): −{item.pairDiscount.toFixed(2)} THB
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="summary-divider" />

      {/* Totals */}
      <div className="summary-row">
        <span>Total (before discount)</span>
        <span>{totalBeforeDiscount.toFixed(2)} THB</span>
      </div>

      {pairDiscountTotal > 0 && (
        <div className="summary-row discount">
          <span>Pair discount (5%)</span>
          <span>−{pairDiscountTotal.toFixed(2)} THB</span>
        </div>
      )}

      {hasMember && (
        <div className="summary-row discount">
          <span>Member card discount (10%)</span>
          <span>−{memberDiscountAmount.toFixed(2)} THB</span>
        </div>
      )}

      <hr className="summary-divider" />

      <div className="summary-row total">
        <span>Final Total</span>
        <span>{finalTotal.toFixed(2)} THB</span>
      </div>
    </div>
  );
}
