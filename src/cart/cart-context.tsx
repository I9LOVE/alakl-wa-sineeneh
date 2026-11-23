"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "./catalog";

// One line in the cart
export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

// Everything the cart shares with the rest of the website
type CartContextValue = {
  cart: OrderItem[];
  cartCount: number;
  cartTotal: number;
  updateQuantity: (product: Product, amount: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // The cart starts empty
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Add or remove a product.
  // amount = 1 adds one, amount = -1 removes one.
  function updateQuantity(product: Product, amount: number) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.id,
      );

      if (!existingItem && amount > 0) {
        return [
          ...currentCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: amount,
          },
        ];
      }

      return currentCart
        .map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0);
    });
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const value: CartContextValue = {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    clearCart: () => setCart([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}