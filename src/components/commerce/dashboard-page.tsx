import type { Product } from "@/lib/store";
import type { CommerceNavItem } from "./types";
import { MetricCard } from "./shared";

type DashboardPageProps = {
  activeProducts: Product[];
  draftProducts: Product[];
  lowStockProducts: Product[];
  cartTotal: number;
  onNavigate: (item: CommerceNavItem) => void;
};

export function DashboardPage({
  activeProducts,
  draftProducts,
  lowStockProducts,
  cartTotal,
  onNavigate,
}: DashboardPageProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
        <h2 className="text-2xl font-semibold">Operations snapshot</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Active Products"
            value={activeProducts.length.toString()}
          />
          <MetricCard
            label="Draft Products"
            value={draftProducts.length.toString()}
          />
          <MetricCard
            label="Low Stock"
            value={lowStockProducts.length.toString()}
          />
          <MetricCard label="Cart Value" value={`$${cartTotal}`} />
        </div>
      </article>
      <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
        <h2 className="text-2xl font-semibold">Quick actions</h2>
        <div className="mt-5 grid gap-3">
          <button
            className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            type="button"
            onClick={() => onNavigate("Products")}
          >
            Manage Products
          </button>
          <button
            className="rounded-full border border-[color:var(--border)] bg-white px-5 py-3 font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
            type="button"
            onClick={() => onNavigate("Inventory")}
          >
            Review Inventory
          </button>
          <button
            className="rounded-full border border-[color:var(--border)] bg-white px-5 py-3 font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
            type="button"
            onClick={() => onNavigate("Cart")}
          >
            Open Cart
          </button>
        </div>
      </article>
    </section>
  );
}
