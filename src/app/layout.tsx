import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "../cart/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "الأكل وسنينه | أكلات مصرية",
  description: "اطلب أكلات مصرية محضرة في البيت من الأكل وسنينه",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
