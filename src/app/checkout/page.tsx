"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "../../cart/cart-context";
import Navbar from "../navbar";
import "./checkout.css";

type Fulfillment = "delivery" | "pickup";

type FormErrors = {
  name?: string;
  phone?: string;
  address?: string;
};

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [address, setAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!fullName.trim()) nextErrors.name = "اكتب الاسم الكامل";

    const digitsOnly = phone.replace(/[^0-9]/g, "");
    if (!phone.trim()) {
      nextErrors.phone = "اكتب رقم الهاتف";
    } else if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      nextErrors.phone = "اكتب رقم هاتف صحيح";
    }

    if (fulfillment === "delivery" && !address.trim()) {
      nextErrors.address = "اكتب عنوان التوصيل";
    }

    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/[^0-9]/g, "");
    if (!whatsappNumber) {
      setSubmitError("رقم واتساب الأكل وسنينه غير متاح حاليًا. يُرجى المحاولة لاحقًا.");
      return;
    }

    const productLines = cart.map((item) =>
      `- ${item.name} × ${item.quantity} — ${item.price} جنيه للقطعة = ${item.price * item.quantity} جنيه`
    );

    const messageLines = [
      "مرحبًا، أريد تأكيد طلب من الأكل وسنينه",
      "",
      "البيانات:",
      `الاسم: ${fullName.trim()}`,
      `رقم الهاتف: ${phone.trim()}`,
      "",
      "الطلب:",
      ...productLines,
      "",
      `إجمالي المنتجات: ${cartTotal} جنيه`,
      `طريقة الاستلام: ${fulfillment === "delivery" ? "توصيل" : "استلام"}`,
    ];

    if (fulfillment === "delivery") {
      messageLines.push(`العنوان: ${address.trim()}`);
      if (deliveryInstructions.trim()) {
        messageLines.push(`تعليمات التوصيل: ${deliveryInstructions.trim()}`);
      }
      messageLines.push("رسوم التوصيل: سيتم تأكيدها عبر واتساب");
    }

    if (notes.trim()) {
      messageLines.push(`ملاحظات إضافية: ${notes.trim()}`);
    }

    messageLines.push("", "يرجى تأكيد الطلب ورسوم التوصيل إن وجدت.");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageLines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="checkout-page min-h-screen bg-[#f7f3ea]" dir="rtl">
      <Navbar />

      <div className="checkout-shell mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6">
          <Link href="/menu" className="text-sm font-bold text-blue-700 hover:text-blue-900">
            → العودة إلى قائمة الطعام
          </Link>
          <h1 className="mt-3 text-3xl font-black">إتمام الطلب</h1>
        </div>

        {cart.length === 0 ? (
          <section className="checkout-empty rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xl font-bold">سلتك فارغة</p>
            <p className="mt-2 text-stone-500">أضف بعض الأكلات إلى السلة قبل إتمام الطلب.</p>
            <Link
              href="/menu"
              className="mt-5 inline-flex rounded-xl bg-[#111111] px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              تصفح قائمة الطعام
            </Link>
          </section>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-6">
                <section className="checkout-card rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="mb-5 text-xl font-bold">بياناتك</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="full-name" className="mb-2 block text-sm font-bold">
                        الاسم الكامل <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "full-name-error" : undefined}
                        className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                      {errors.name && (
                        <p id="full-name-error" className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-bold">
                        رقم الهاتف <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                      {errors.phone && (
                        <p id="phone-error" className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="checkout-card rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="mb-5 text-xl font-bold">طريقة الاستلام</h2>

                  <fieldset>
                    <legend className="sr-only">اختر طريقة الاستلام</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className={`cursor-pointer rounded-xl border p-4 ${fulfillment === "delivery" ? "border-blue-600 bg-blue-50" : "border-stone-300"}`}>
                        <input
                          type="radio"
                          name="fulfillment"
                          value="delivery"
                          checked={fulfillment === "delivery"}
                          onChange={() => setFulfillment("delivery")}
                          className="ml-2"
                        />
                        توصيل للعنوان
                      </label>
                      <label className={`cursor-pointer rounded-xl border p-4 ${fulfillment === "pickup" ? "border-blue-600 bg-blue-50" : "border-stone-300"}`}>
                        <input
                          type="radio"
                          name="fulfillment"
                          value="pickup"
                          checked={fulfillment === "pickup"}
                          onChange={() => setFulfillment("pickup")}
                          className="ml-2"
                        />
                        استلام
                      </label>
                    </div>
                  </fieldset>

                  {fulfillment === "delivery" ? (
                    <div className="mt-5 space-y-4">
                      <div>
                        <label htmlFor="address" className="mb-2 block text-sm font-bold">
                          عنوان التوصيل <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="address"
                          type="text"
                          autoComplete="street-address"
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          aria-invalid={Boolean(errors.address)}
                          aria-describedby={errors.address ? "address-error" : undefined}
                          className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                        {errors.address && (
                          <p id="address-error" className="mt-1 text-sm text-red-600">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="delivery-instructions" className="mb-2 block text-sm font-bold">
                          تعليمات التوصيل
                        </label>
                        <textarea
                          id="delivery-instructions"
                          rows={3}
                          value={deliveryInstructions}
                          onChange={(event) => setDeliveryInstructions(event.target.value)}
                          className="w-full resize-y rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        رسوم التوصيل تعتمد على المسافة وغير محددة هنا. سيتم تأكيدها معك عبر واتساب.
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
                      اخترت الاستلام. لن نطلب عنوانًا للتوصيل.
                    </div>
                  )}
                </section>

                <section className="checkout-card rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                  <label htmlFor="notes" className="mb-2 block text-xl font-bold">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="مثلًا: بدون بصل، أو طلب خاص"
                    className="w-full resize-y rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </section>
              </div>

              <aside className="checkout-summary h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 sm:p-6">
                <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="border-b border-stone-100 pb-4 last:border-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="mt-1 text-sm text-stone-500">
                            {item.quantity} × {item.price} جنيه
                          </p>
                        </div>
                        <p className="font-bold">{item.price * item.quantity} جنيه</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4 text-lg font-black">
                  <span>إجمالي المنتجات</span>
                  <span>{cartTotal} جنيه</span>
                </div>

                {submitError && (
                  <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-5 w-full rounded-xl bg-[#25D366] px-5 py-3.5 font-black text-white shadow-sm transition hover:bg-[#1fb85a]"
                >
                  إرسال الطلب عبر واتساب
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-stone-500">
                  سيتم فتح واتساب برسالة جاهزة. أرسل الرسالة بنفسك، ولا يعتبر الطلب مؤكدًا إلا بعد تأكيد الأكل وسنينه لك.
                </p>
              </aside>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
