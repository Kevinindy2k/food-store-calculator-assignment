const API_BASE = "/api";

/**
 * Fetch the product list from the API.
 * @returns {Promise<Array>} list of products
 */
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

/**
 * Send an order to the calculate endpoint.
 * @param {Array<{productId: string, quantity: number}>} items
 * @param {string|null} memberCard
 * @returns {Promise<object>} calculation result
 */
export async function calculateOrder(items, memberCard) {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, memberCard: memberCard || null }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Calculation failed");
  }

  return data;
}
