"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../cart/cart-context";
import { products } from "../cart/catalog";

export default function Menu() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, cartCount, cartTotal, updateQuantity } = useCart();

  return (
    <div className="relative flex flex-col gap-4 p-4">
      {isCartOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-black/40"
          onClick={() => setIsCartOpen(false)}
          aria-label="Close cart"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(360px,90vw)] flex-col bg-[#fffdf8] shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-xl font-bold">سلة الطلبات</h2>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none hover:bg-gray-100"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="mt-16 text-center text-gray-500">السلة فارغة</div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => {
                const product = products.find(
                  (candidate) => candidate.id === item.productId
                );

                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-xl border bg-white p-3"
                  >
                    <img
                      src={product.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.price * item.quantity} :جنيه
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product, -1)}
                          className="h-8 w-8 rounded-lg border"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>
                        <span className="min-w-5 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product, 1)}
                          className="h-8 w-8 rounded-lg border"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t bg-white p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-bold">
            <span>الإجمالي</span>
            <span>{cartTotal} جنيه</span>
          </div>
          <Link
            href="/checkout"
            aria-disabled={cart.length === 0}
            onClick={(event) => {
              if (cart.length === 0) event.preventDefault();
            }}
            className={`block w-full rounded-xl py-3 text-center font-bold text-white ${
              cart.length === 0
                ? "pointer-events-none cursor-not-allowed bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            إتمام الطلب
          </Link>
        </div>
      </aside>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">قائمة الطعام</h1>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 font-semibold text-white shadow-md transition hover:bg-blue-700"
          aria-label={`Open cart with ${cartCount} items`}
        >
          <span aria-hidden="true">🛒</span>
          <span>السلة ({cartCount})</span>
        </button>
      </div>

      {products.map((product) => {
        const quantity =
          cart.find((item) => item.productId === product.id)?.quantity ?? 0;

        return (
          <div
            key={product.id}
            className="flex w-full items-center gap-4 rounded-xl border p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-28 w-28 rounded-lg object-cover"
            />

            <div className="flex flex-1 flex-col gap-2">
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p className="font-bold">{product.price} جنيه</p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(product, -1)}
                  disabled={quantity === 0}
                  className="rounded-lg border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Decrease ${product.name} quantity`}
                >
                  -
                </button>

                <p className="min-w-5 text-center font-semibold">{quantity}</p>

                <button
                  type="button"
                  onClick={() => updateQuantity(product, 1)}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                  aria-label={`Increase ${product.name} quantity`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
