import type { ChangeEvent } from "react";
import type { Product } from "@/lib/store";
import { StatusBadge } from "./shared";

type InventoryPageProps = {
  products: Product[];
  lowStockProducts: Product[];
  uploadSummary: string;
  maxUploadSizeMb: number;
  templateHref: string;
  onUploadInventoryFile: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function InventoryPage({
  products,
  lowStockProducts,
  uploadSummary,
  maxUploadSizeMb,
  templateHref,
  onUploadInventoryFile,
}: InventoryPageProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Inventory</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Stock data grouped by product status and risk.
            </p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium">
            {lowStockProducts.length} low stock
          </span>
        </div>
        <div className="overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[color:var(--surface-strong)] text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-[color:var(--border)]"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      {product.productCode}
                    </p>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    {product.stock <= 10 ? "Low stock" : "Healthy"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Stock alerts</h2>
        <div className="mt-5 grid gap-3">
          {lowStockProducts.length === 0 ? (
            <p className="rounded-[1.25rem] bg-white p-4 text-sm text-[color:var(--muted)]">
              No low-stock products right now.
            </p>
          ) : (
            lowStockProducts.map((product) => (
              <div key={product.id} className="rounded-[1.25rem] bg-white p-4">
                <p className="font-semibold">{product.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {product.productCode}
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  Only {product.stock} units remain.
                </p>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 rounded-[1.4rem] border border-dashed border-[color:var(--border)] bg-white p-5">
          <h3 className="text-lg font-semibold">Bulk inventory upload</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Upload a CSV stock sheet up to {maxUploadSizeMb} MB. Use the sample
            template for the expected columns.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="inline-flex cursor-pointer rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg">
              <span>Upload Inventory CSV</span>
              <input
                className="sr-only"
                type="file"
                accept=".csv,text/csv"
                onChange={onUploadInventoryFile}
              />
            </label>
            <a
              className="inline-flex rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100"
              href={templateHref}
              download="inventory-upload-template.csv"
            >
              Download Sample Template
            </a>
          </div>
          <p className="mt-4 text-sm text-[color:var(--muted)]" role="status">
            {uploadSummary}
          </p>
        </div>
      </article>
    </section>
  );
}
