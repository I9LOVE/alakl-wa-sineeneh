"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { products, type Product } from "./catalog";

export type OrderItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  cart: OrderItem[];
  cartCount: number;
  cartTotal: number;
  updateQuantity: (product: Product, amount: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "alakl-wa-sineeneh-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsedCart: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          const validItems = parsedCart.flatMap((item: unknown): OrderItem[] => {
            if (typeof item !== "object" || item === null) return [];

            const savedItem = item as Record<string, unknown>;
            const productId = savedItem.productId;
            const quantity = savedItem.quantity;

            if (
              typeof productId !== "string" ||
              typeof quantity !== "number" ||
              !Number.isInteger(quantity) ||
              quantity <= 0
            ) {
              return [];
            }

            const productExists = products.some(
              (product) => product.id === productId
            );

            if (!productExists) return [];

            return [{ productId, quantity }];
          });

          setCart(validItems);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }

    setIsLoaded(true);
  }, []);

  // Save the cart whenever it changes.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart, isLoaded]);

  function updateQuantity(product: Product, amount: number) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.id
      );

      if (!existingItem) {
        if (amount <= 0) return currentCart;

        return [
          ...currentCart,
          {
            productId: product.id,
            quantity: amount,
          },
        ];
      }

      return currentCart
        .map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find(
      (candidate) => candidate.id === item.productId
    );

    return product ? total + product.price * item.quantity : total;
  }, 0);

  const value: CartContextValue = {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    clearCart: () => setCart([]),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
