import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const CART_WIDGET_EVENT = "cart-to-whatsapp:updated";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tor_cart");

      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Could not load cart:", error);
    }

    setLoaded(true);
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem("tor_cart", JSON.stringify(items));
    } catch (error) {
      console.error("Could not save cart:", error);
    }
  }, [items, loaded]);

  // Send cart changes to the Cart-to-WhatsApp widget
  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;

    const itemCount = items.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0
    );

    const cartTotal = items.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.qty || 0),
      0
    );

    const cartData = {
      item_count: itemCount,
      total_price: cartTotal,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        title: item.name,
        qty: Number(item.qty || 0),
        quantity: Number(item.qty || 0),
        price: Number(item.price || 0),
        img: item.img || "",
        image: item.img || "",
        size: item.size || "",
        variantTitle: item.size || "",
      })),
    };

    const sendCartToWidget = () => {
      const widget = window.CartToWhatsAppWidget;

      if (widget && typeof widget.updateCart === "function") {
        widget.updateCart(cartData);
        return true;
      }

      // Keep event-based compatibility
      window.dispatchEvent(
        new CustomEvent(CART_WIDGET_EVENT, {
          detail: cartData,
        })
      );

      return false;
    };

    // Send immediately if the widget has loaded
    if (sendCartToWidget()) {
      return;
    }

    // If the widget loads after React, retry until it is available
    const timer = window.setInterval(() => {
      if (sendCartToWidget()) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [items, loaded]);

  const addItem = (product, size) => {
    setItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) =>
          item.productId === product.id &&
          item.size === size
      );

      if (existingItem) {
        return previousItems.map((item) =>
          item.productId === product.id &&
          item.size === size
            ? {
                ...item,
                qty: Number(item.qty || 0) + 1,
              }
            : item
        );
      }

      return [
        ...previousItems,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price || 0),
          img: product.images?.[0] || "",
          size,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (productId, size, qty) => {
    if (qty <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems((previousItems) =>
      previousItems.map((item) =>
        item.productId === productId &&
        item.size === size
          ? {
              ...item,
              qty,
            }
          : item
      )
    );
  };

  const removeItem = (productId, size) => {
    setItems((previousItems) =>
      previousItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size
          )
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const count = items.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}