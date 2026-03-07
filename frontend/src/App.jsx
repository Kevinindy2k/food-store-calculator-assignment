import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "./components/ProductCard.jsx";
import MemberCardInput from "./components/MemberCardInput.jsx";
import OrderSummary from "./components/OrderSummary.jsx";
import { fetchProducts, calculateOrder } from "./services/api.js";

export default function App() {
  // ── State ──────────────────────────────────
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});   // { productId: number }
  const [memberCard, setMemberCard] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Load products on mount ─────────────────
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        const initial = {};
        data.forEach((p) => (initial[p.id] = 0));
        setQuantities(initial);
      })
      .catch((err) => setError(err.message));
  }, []);

  // ── Quantity helpers ───────────────────────
  const addOne = useCallback((id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setResult(null); // clear previous result when order changes
  }, []);

  const removeOne = useCallback((id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
    setResult(null);
  }, []);

  // ── Calculate ──────────────────────────────
  const handleCalculate = async () => {
    setError(null);
    setResult(null);

    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (items.length === 0) {
      setError("Please add at least one item to your order.");
      return;
    }

    setLoading(true);
    try {
      const data = await calculateOrder(items, memberCard);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Has any item? (for button state) ───────
  const hasItems = Object.values(quantities).some((q) => q > 0);

  // ── Render ─────────────────────────────────
  return (
    <div className="app">
      <h1 className="app-title">🍱 Food Store Calculator</h1>
      <p className="app-subtitle">Select items, enter member card, and calculate!</p>

      {error && <div className="error-banner">{error}</div>}

      {/* Product list */}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.id] || 0}
            onAdd={() => addOne(product.id)}
            onRemove={() => removeOne(product.id)}
          />
        ))}
      </div>

      {/* Member card */}
      <MemberCardInput value={memberCard} onChange={setMemberCard} />

      {/* Calculate */}
      <button
        className="calc-btn"
        onClick={handleCalculate}
        disabled={!hasItems || loading}
      >
        {loading ? "Calculating…" : "Calculate"}
      </button>

      {/* Result */}
      <OrderSummary result={result} />
    </div>
  );
}
