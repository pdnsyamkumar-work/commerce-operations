import type { Product } from "@/lib/store";
import { StatusBadge } from "./shared";

type ProductDetailsPageProps = {
  product?: Product;
  onBackToProducts: () => void;
  onEdit: (product: Product) => void;
  onAddToCart: (id: string) => void;
};

export function ProductDetailsPage({
  product,
  onBackToProducts,
  onEdit,
  onAddToCart,
}: ProductDetailsPageProps) {
  const detailImages = product?.images.length
    ? product.images
    : [fallbackImage(product?.name ?? "Product")];

  if (!product) {
    return (
      <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          The selected product is no longer available.
        </p>
        <button
          className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          type="button"
          onClick={onBackToProducts}
        >
          Back to Products
        </button>
      </article>
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
        <button
          className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
          type="button"
          onClick={onBackToProducts}
        >
          Back to Products
        </button>
        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {product.productCode}
            </p>
            <h2 className="mt-2 break-words text-3xl font-semibold sm:text-4xl">{product.name}</h2>
            <p className="mt-3 text-lg text-[color:var(--muted)]">
              {product.category}
            </p>
          </div>
          <StatusBadge status={product.status} />
        </div>
        <div className="mt-8 grid gap-3">
          <img
            className="h-72 w-full rounded-[1.5rem] object-cover"
            src={detailImages[0]}
            alt={product.name}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {detailImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                className="h-24 rounded-2xl object-cover"
                src={image}
                alt={`${product.name} ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <DetailMetric label="Price" value={`$${product.price}`} />
          <DetailMetric label="Stock" value={`${product.stock} units`} />
          <DetailMetric
            label="Health"
            value={product.stock <= 10 ? "Low stock" : "Healthy"}
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
            type="button"
            onClick={() => onEdit(product)}
          >
            Edit Product
          </button>
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            type="button"
            onClick={() => onAddToCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      </article>
      <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
        <h3 className="text-2xl font-semibold">Product details</h3>
        <ul className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
          <li>Single product details navigation</li>
          <li>Back navigation to products</li>
          <li>Detail action buttons</li>
          <li>Status and stock assertions</li>
        </ul>
      </article>
    </section>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function fallbackImage(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260"><rect width="420" height="260" rx="28" fill="#334155"/><text x="40" y="135" fill="white" font-family="Arial" font-size="34" font-weight="700">${label.slice(0, 18)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
