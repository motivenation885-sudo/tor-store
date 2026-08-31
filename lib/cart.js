import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tor_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("tor_cart", JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items, loaded]);

  const addItem = (product, size) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, price: product.price, img: product.images[0], size, qty: 1 },
      ];
    });
  };

  const updateQty = (productId, size, qty) => {
    if (qty <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.size === size ? { ...i, qty } : i))
    );
  };

  const removeItem = (productId, size) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
