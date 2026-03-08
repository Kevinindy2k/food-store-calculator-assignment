/**
 * Renders a single product card with quantity +/- controls.
 */
export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <div className="product-card">
      <div
        className="product-dot"
        style={{ backgroundColor: product.color }}
      />
      <div className="product-name">{product.name}</div>
      <div className="product-price">{product.price} THB</div>
      <div className="qty-controls">
        <button
          className="qty-btn"
          onClick={onRemove}
          disabled={quantity === 0}
          aria-label={`Remove one ${product.name}`}
        >
          −
        </button>
        <span className="qty-value">{quantity}</span>
        <button
          className="qty-btn"
          onClick={onAdd}
          aria-label={`Add one ${product.name}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
