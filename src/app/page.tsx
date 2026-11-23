import Navbar from "./navbar";
import OrderButton from "./orderbtn";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen bg-transparent">
      <Navbar />

      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[0.04em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl lg:text-7xl">
            الطعم اللي يفكّرك بلمة البيت
          </h1>
          <OrderButton />
        </div>
      </section>
    </main>
  );
}
