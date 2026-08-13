import { useRef, useState } from "react";
import type { CartItem, Product } from "@/lib/store";
import { useClickOutside } from "./shared";

type CartPageProps = {
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string;
  cartTotal: number;
  onSelectedProductChange: (id: string) => void;
  onAddToCart: () => void;
  onRemoveCartItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
};

export function CartPage({
  products,
  cartItems,
  selectedProductId,
  cartTotal,
  onSelectedProductChange,
  onAddToCart,
  onRemoveCartItem,
  onUpdateQuantity,
}: CartPageProps) {
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );
  const [viewedItem, setViewedItem] = useState<CartItem | null>(null);
  const viewedProduct = viewedItem
    ? products.find((product) => product.id === viewedItem.productId)
    : undefined;

  return (
    <section className="grid gap-6 xl:grid-cols-1">
      <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Cart</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Add catalog items to the cart, adjust quantities, and remove items
            when needed.
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.4rem] bg-[color:var(--surface-strong)] p-4">
          <ProductDropdown
            products={products}
            selectedLabel={selectedProduct?.name ?? "Choose product"}
            onSelect={onSelectedProductChange}
          />
          <button
            className="cursor-pointer rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg"
            type="button"
            data-testid="add-product-btn"
            onClick={onAddToCart}
          >
            Add Selected Product
          </button>
          <p
            data-testid="cart-total"
            className="text-sm text-[color:var(--muted)]"
          >
            Cart total: ${cartTotal}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {cartItems.length === 0 ? (
            <div className="rounded-[1.4rem] border border-dashed border-[color:var(--border)] p-5 text-sm text-[color:var(--muted)]">
              <span>
                Cart is empty. Add a product to begin checkout preparation.
              </span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.4rem] border border-[color:var(--border)] bg-white p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3
                      className="font-semibold"
                      data-testid={`cart-item-${item.id}`}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-[color:var(--muted)]">
                      ${item.unitPrice} each &middot; {item.id}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      data-testid={`view-btn-${item.id}`}
                      className="cursor-pointer rounded-full px-3 py-1 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-100 hover:text-slate-950"
                      type="button"
                      onClick={() => setViewedItem(item)}
                    >
                      View
                    </button>
                    <button
                      data-testid={`remove-btn-${item.id}`}
                      className="cursor-pointer rounded-full px-3 py-1 text-sm font-medium text-rose-700 transition duration-200 hover:bg-rose-50 hover:text-rose-800"
                      type="button"
                      onClick={() => onRemoveCartItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    data-testid={`decrease-btn-${item.id}`}
                    className="cursor-pointer rounded-full border border-[color:var(--border)] px-4 py-2 text-sm transition duration-200 hover:border-slate-400 hover:bg-slate-900 hover:text-white"
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span
                    className="flex min-w-14 items-center justify-center rounded-full bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-semibold"
                    data-testid={`quantity-${item.id}`}
                  >
                    {item.quantity}
                  </span>
                  <button
                    data-testid={`increase-btn-${item.id}`}
                    className="cursor-pointer rounded-full border border-[color:var(--border)] px-4 py-2 text-sm transition duration-200 hover:border-slate-400 hover:bg-slate-900 hover:text-white"
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
      {viewedItem && (
        <CartItemDialog
          item={viewedItem}
          product={viewedProduct}
          onClose={() => setViewedItem(null)}
        />
      )}
    </section>
  );
}

function ProductDropdown({
  products,
  selectedLabel,
  onSelect,
}: {
  products: Product[];
  selectedLabel: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div ref={dropdownRef} className="relative">
      <button
        data-testid="product-dropdown"
        className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-left transition duration-200 hover:bg-slate-50"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selectedLabel}</span>
        <span>v</span>
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-[color:var(--border)] bg-white p-2 shadow-xl">
          {products.map((product) => (
            <button
              data-testid={`product-option-${product.id}`}
              key={product.id}
              className="w-full rounded-xl px-3 py-2 text-left text-sm transition duration-200 hover:bg-slate-100"
              type="button"
              onClick={() => {
                onSelect(product.id);
                setOpen(false);
              }}
            >
              <span className="font-semibold">{product.name}</span>
              <span className="ml-2 text-xs text-[color:var(--muted)]">
                {product.productCode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CartItemDialog({
  item,
  product,
  onClose,
}: {
  item: CartItem;
  product?: Product;
  onClose: () => void;
}) {
  const subtotal = item.quantity * item.unitPrice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-item-dialog-title"
    >
      <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Cart item
            </p>
            <h2
              id="cart-item-dialog-title"
              className="mt-2 text-2xl font-semibold"
            >
              {item.name}
            </h2>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white transition duration-200 hover:bg-rose-700"
            type="button"
            data-testid="close-cart-dialog"
            aria-label="Close cart item details"
            onClick={onClose}
          >
            x
          </button>
        </div>
        {product?.images[0] && (
          <img
            className="mt-5 h-48 w-full rounded-[1.25rem] object-cover"
            src={product.images[0]}
            alt={item.name}
          />
        )}
        <div className="mt-5 grid gap-3 rounded-[1.25rem] bg-[color:var(--surface-strong)] p-4 text-sm">
          <p>
            <strong>Product code:</strong>{" "}
            {product?.productCode ?? item.productId}
          </p>
          <p>
            <strong>Category:</strong> {product?.category ?? "Unavailable"}
          </p>
          <p data-testid="popup-quantity">
            <strong>Quantity:</strong>
            {item.quantity}
          </p>

          <p data-testid="popup-unit-price">
            <strong>Unit price:</strong>${item.unitPrice}
          </p>

          <p data-testid="popup-subtotal">
            <strong>Subtotal:</strong>${subtotal}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            type="button"
            data-testid="popup-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
