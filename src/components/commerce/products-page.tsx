import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Product } from "@/lib/store";
import type { ProductDraft, ProductFormErrors } from "./types";
import {
  validateProductDraft,
  type ProductFieldName,
} from "./product-validation";
import { InlineError, StatusBadge, useClickOutside } from "./shared";

const productsPerPage = 5;
const maxProductImages = 6;
type ProductViewMode =
  | "table"
  | "grid"
  | "list"
  | "kanban"
  | "gallery"
  | "detail"
  | "bulk";
type ProductSortKey =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "stock-asc"
  | "stock-desc"
  | "status-asc";

const productViewModes: Array<{ id: ProductViewMode; label: string }> = [
  { id: "table", label: "Table" },
  { id: "grid", label: "Grid" },
  { id: "list", label: "List" },
  { id: "kanban", label: "Kanban" },
  { id: "gallery", label: "Gallery" },
  { id: "detail", label: "Detail" },
  { id: "bulk", label: "Bulk" },
];

const sortOptions: Array<{ id: ProductSortKey; label: string }> = [
  { id: "name-asc", label: "Name A-Z" },
  { id: "name-desc", label: "Name Z-A" },
  { id: "price-asc", label: "Price Low-High" },
  { id: "price-desc", label: "Price High-Low" },
  { id: "stock-asc", label: "Stock Low-High" },
  { id: "stock-desc", label: "Stock High-Low" },
  { id: "status-asc", label: "Status" },
];

type ProductsPageProps = {
  products: Product[];
  draft: ProductDraft;
  errors: ProductFormErrors;
  editingProductId: string | null;
  onDraftChange: (
    patch: Partial<ProductDraft>,
    field?: ProductFieldName,
  ) => void;
  onDraftFieldBlur: (field: ProductFieldName) => void;
  onSubmitProduct: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
  onStartEdit: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSelectProductForCart: (id: string) => void;
  onViewProductDetails: (id: string) => void;
  onBulkToggleStatus: (products: Product[]) => void;
  onBulkDeleteProducts: (products: Product[]) => void;
  onBulkAddToCart: (products: Product[]) => void;
};

export function ProductsPage({
  products,
  draft,
  errors,
  editingProductId,
  onDraftChange,
  onDraftFieldBlur,
  onSubmitProduct,
  onCancelEdit,
  onStartEdit,
  onToggleStatus,
  onDeleteProduct,
  onSelectProductForCart,
  onViewProductDetails,
  onBulkToggleStatus,
  onBulkDeleteProducts,
  onBulkAddToCart,
}: ProductsPageProps) {
  const isEditing = Boolean(editingProductId);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ProductViewMode>("table");
  const [sortKey, setSortKey] = useState<ProductSortKey>("name-asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id ?? "",
  );
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLimitError, setImageLimitError] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const matches = query
      ? products.filter((product) =>
          [
            product.name,
            product.category,
            product.productCode,
            product.status,
          ].some((value) => value.toLowerCase().includes(query)),
        )
      : products;

    return [...matches].sort((a, b) => {
      switch (sortKey) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        case "status-asc":
          return (
            a.status.localeCompare(b.status) || a.name.localeCompare(b.name)
          );
        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchTerm, sortKey]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, safeCurrentPage]);
  const selectedProduct =
    filteredProducts.find((product) => product.id === selectedProductId) ??
    visibleProducts[0];
  const activeProducts = visibleProducts.filter(
    (product) => product.status === "Active",
  );
  const draftProducts = visibleProducts.filter(
    (product) => product.status === "Draft",
  );
  const selectedBulkProducts = products.filter((product) =>
    selectedBulkIds.includes(product.id),
  );
  const hasMixedBulkStatuses =
    new Set(selectedBulkProducts.map((product) => product.status)).size > 1;
  const productDownloadHref = `data:text/csv;charset=utf-8,${encodeURIComponent(toProductsCsv(filteredProducts))}`;
  const isSubmitDisabled = Object.keys(validateProductDraft(draft)).length > 0;
  const isImageUploadDisabled = draft.images.length >= maxProductImages;

  function goToPage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
    setSelectedBulkIds([]);
  }

  function updateSearch(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedBulkIds([]);
  }

  function updateSort(value: ProductSortKey) {
    setSortKey(value);
    setCurrentPage(1);
  }

  async function handleImageAttachment(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = maxProductImages - draft.images.length;

    if (remainingSlots <= 0) {
      setImageLimitError(`Maximum ${maxProductImages} product images allowed.`);
      event.target.value = "";
      return;
    }

    if (files.length > remainingSlots) {
      setImageLimitError(
        `You can upload only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"}. Maximum ${maxProductImages} images allowed.`,
      );
    } else {
      setImageLimitError("");
    }

    const images = await Promise.all(
      files.slice(0, remainingSlots).map(readImageFile),
    );
    onDraftChange({ images: [...draft.images, ...images] });
    event.target.value = "";
  }

  function removeDraftImage(indexToRemove: number) {
    setImageLimitError("");
    onDraftChange({
      images: draft.images.filter((_, index) => index !== indexToRemove),
    });
  }

  function toggleBulkSelection(id: string) {
    setSelectedBulkIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function setBulkSelection(nextIds: string[]) {
    setSelectedBulkIds(nextIds);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.8fr]">
      <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {isEditing ? "Edit product" : "Create product"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            {isEditing
              ? "Update catalog details, stock, pricing, images, and publishing status."
              : "Add a new product with pricing, stock, category, images, and publishing status."}
          </p>
        </div>
        <form className="grid gap-4" onSubmit={onSubmitProduct} noValidate>
          <label className="grid gap-2 text-sm font-semibold">
            <span>
              Product name <span className="text-rose-600">*</span>
            </span>
            <input
             data-testid="input-field-product-name"
              className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
              placeholder="Example: Canvas Weekender Bag"
              value={draft.name}
              onChange={(event) =>
                onDraftChange({ name: event.target.value }, "name")
              }
              onBlur={() => onDraftFieldBlur("name")}
            />
            <InlineError id="product-name" message={errors.name} 
              dataTestId={
    errors.name === "Product name is required."
      ? "error-field-product-name-required"
      : errors.name === "Product_name error"
        ? "error-field-Product name must be at least 3 characters."
        : errors.name === "Product name should not exceed more than 100 characters."
          ? "error-field-product-name-should not exceed more than 100 characters."
          : errors.name ===
              "Product name may contain letters, numbers, spaces, &, apostrophes, or hyphens."
            ? "error-field-product-name-may contain letters, numbers, spaces, &, apostrophes, or hyphens."
            : undefined
  }
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            <span>
              Product code <span className="text-rose-600">*</span>
            </span>
            <input
             data-testid="input-field-product-code"
              className={`rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal ${isEditing ? "bg-slate-100 text-slate-500" : ""}`}
              placeholder="Example: PRD-111"
              value={draft.productCode}
              readOnly={isEditing}
              onChange={(event) =>
                onDraftChange(
                  { productCode: event.target.value.toUpperCase() },
                  "productCode",
                )
              }
              onBlur={() => onDraftFieldBlur("productCode")}
            />
            <InlineError id="product-code" message={errors.productCode} 
               dataTestId={
    errors.productCode === "Product code is required."
      ? "error-field-product-code-required"
      : errors.productCode?.includes("at most")
        ? "error-field-Product code must be at most 20 characters"
        : errors.productCode ===
            "Product code may contain letters, numbers, and hyphens only."
          ? "error-field-Product code may contain letters, numbers, and hyphens only"
          : undefined
  }

            />
            {isEditing && (
              <p className="text-xs font-normal text-[color:var(--muted)]">
                Product code is locked after creation.
              </p>
            )}
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            <span>
              Category <span className="text-rose-600">*</span>
            </span>
            <input
              data-testid="input-field-category"
              className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
              placeholder="Example: Travel"
              value={draft.category}
              onChange={(event) =>
                onDraftChange({ category: event.target.value }, "category")
              }
              onBlur={() => onDraftFieldBlur("category")}
            />
            <InlineError id="category" message={errors.category}
               dataTestId={
    errors.category === "Category is required."
      ? "error-field-category-required"
      : errors.category === "Category must be at least 2 characters."
        ? "error-field-Category must be at least 2 characters"
        : errors.category?.includes("at most")
          ? "error-field-Category must be at most 40 characters"
          : errors.category ===
              "Category may contain letters and spaces only."
            ? "error-field-Category may contain letters and spaces only"
            : undefined
  }

             />
          </label>
          <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
            <label className="grid min-w-0 gap-2 text-sm font-semibold">
              <span>
                Price <span className="text-rose-600">*</span>
              </span>
              <input
                data-testid="input-field-price"
                className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                type="text"
                inputMode="decimal"
                placeholder="Example: 84"
                value={draft.price}
                onChange={(event) =>
                  onDraftChange(
                    { price: event.target.value.replace(/[^0-9.]/g, "") },
                    "price",
                  )
                }
                onBlur={() => onDraftFieldBlur("price")}
              />
              <InlineError id="price" message={errors.price}
                 dataTestId={
    errors.price === "Price is required."
      ? "error-field-price-required"
      : errors.price?.includes("at most 7 characters")
        ? "error-field-Price must be at most 7 characters"
        : errors.price === "Price must be at least 1."
          ? "error-field-price-must be at least 1"
          : errors.price === "Price must be at most 99,999."
            ? "error-field-Price must be at most 99,999."
            : undefined
  }
               />
            </label>
            <label className="grid min-w-0 gap-2 text-sm font-semibold">
              <span>
                Stock <span className="text-rose-600">*</span>
              </span>
              <input
                data-testid="input-field-stock"
                className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
                type="text"
                inputMode="numeric"
                placeholder="Example: 12"
                value={draft.stock}
                onChange={(event) =>
                  onDraftChange(
                    { stock: event.target.value.replace(/[^0-9]/g, "") },
                    "stock",
                  )
                }
                onBlur={() => onDraftFieldBlur("stock")}
              />
              <InlineError id="stock" message={errors.stock}
                dataTestId={
    errors.stock === "Stock is required."
      ? "error-field-stock-required"
      : errors.stock?.includes("at most 5 characters")
        ? "error-field-stock at most 5 characters"
        : errors.stock ===
            "Stock must be a whole number greater than or equal to 0."
          ? "error-field-stock-invalid"
          : errors.stock === "Stock must be at most 10,000 units."
            ? "error-field-stock-value-max"
            : undefined
  }
               />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            <span>
              Status <span className="text-rose-600">*</span>
            </span>
            <select
             data-testid="dropdown-field-status"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 font-normal"
              value={draft.status}
              onChange={(event) =>
                onDraftChange(
                  {
                    status: event.target.value as Product["status"],
                  },
                  "status",
                )
              }
              onBlur={() => onDraftFieldBlur("status")}
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
            <InlineError id="product-status" message={errors.status}
             dataTestId="error-field-status"
             />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            <span>
              Product images <span className="text-rose-600">*</span>
            </span>
            <span
             data-testid="upload-field-product-images"
              className={`inline-flex items-center justify-center rounded-2xl border border-dashed px-4 py-3 font-semibold transition duration-200 ${isImageUploadDisabled ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400" : "cursor-pointer border-[color:var(--border)] bg-white text-slate-900 hover:bg-slate-100"}`}
            >
              {isImageUploadDisabled
                ? "Maximum images reached"
                : "Choose files"}
            </span>
            <input
            data-testid="upload-input-product-images"
              className="sr-only"
              type="file"
              accept="image/*"
              multiple
              disabled={isImageUploadDisabled}
              onChange={handleImageAttachment}
            />
            <InlineError
              id="product-images"
              message={imageLimitError || errors.images}
                 dataTestId={
    imageLimitError
      ? "error-field-product-images-limit"
      : "error-field-product-images-required"
  }
            />
            <p className="text-xs font-normal text-[color:var(--muted)]">
              Attach at least 1 image and up to {maxProductImages} images.
            </p>
          </label>
          {draft.images.length > 0 && (
            <ImageAttachmentList
              images={draft.images}
              onPreview={setPreviewImage}
              onRemove={removeDraftImage}
            />
          )}

          <div className="flex flex-wrap gap-3">
            <button
            data-testid="btn-field-create-product"
              className="cursor-pointer rounded-full bg-[color:var(--accent)] px-5 py-3 font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[color:var(--accent)] disabled:hover:shadow-sm"
              type="submit"
              disabled={isSubmitDisabled}
            >
              {isEditing ? "Save Product" : "Create Product"}
            </button>
            {isEditing && (
              <button
                className="rounded-full border border-[color:var(--border)] bg-white px-5 py-3 font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
                type="button"
                onClick={onCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </article>

      <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Products</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Review catalog items, edit details, update status, or remove
              discontinued products.
            </p>
          </div>
          <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium">
            {filteredProducts.length} shown
          </span>
        </div>
        <div className="mb-5 grid gap-3 xl:grid-cols-[1fr_220px_220px_auto]">
          <input
            className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3"
            placeholder="Search by product, category, code, or status"
            value={searchTerm}
            onChange={(event) => updateSearch(event.target.value)}
          />
          <SortDropdown value={sortKey} onChange={updateSort} />
          <BulkSelectDropdown
            products={filteredProducts}
            selectedIds={selectedBulkIds}
            onChange={setBulkSelection}
          />
          <a
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
            href={productDownloadHref}
            download="products-export.csv"
          >
            Download CSV
          </a>
        </div>
        <div className="mb-5 flex max-w-full flex-wrap gap-1 rounded-[1.25rem] border border-[color:var(--border)] bg-white p-1">
          {productViewModes.map((mode) => (
            <button
              key={mode.id}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${viewMode === mode.id ? "bg-slate-950 text-white hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
              type="button"
              aria-pressed={viewMode === mode.id}
              onClick={() => setViewMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
        {selectedBulkIds.length > 0 && (
          <BulkToolbar
            selectedCount={selectedBulkIds.length}
            hasMixedStatuses={hasMixedBulkStatuses}
            onToggle={() => onBulkToggleStatus(selectedBulkProducts)}
            onDelete={() => onBulkDeleteProducts(selectedBulkProducts)}
            onAddToCart={() => onBulkAddToCart(selectedBulkProducts)}
          />
        )}

        {viewMode === "table" && (
          <TableView
            products={visibleProducts}
            onStartEdit={onStartEdit}
            onToggleStatus={onToggleStatus}
            onDeleteProduct={onDeleteProduct}
            onSelectProductForCart={onSelectProductForCart}
            onViewProductDetails={onViewProductDetails}
          />
        )}
        {viewMode === "grid" && (
          <GridView
            products={visibleProducts}
            onStartEdit={onStartEdit}
            onToggleStatus={onToggleStatus}
            onDeleteProduct={onDeleteProduct}
            onSelectProductForCart={onSelectProductForCart}
            onViewProductDetails={onViewProductDetails}
          />
        )}
        {viewMode === "list" && (
          <ListView
            products={visibleProducts}
            onStartEdit={onStartEdit}
            onToggleStatus={onToggleStatus}
            onDeleteProduct={onDeleteProduct}
            onSelectProductForCart={onSelectProductForCart}
            onViewProductDetails={onViewProductDetails}
          />
        )}
        {viewMode === "kanban" && (
          <KanbanView
            activeProducts={activeProducts}
            draftProducts={draftProducts}
            onStartEdit={onStartEdit}
            onToggleStatus={onToggleStatus}
            onDeleteProduct={onDeleteProduct}
            onSelectProductForCart={onSelectProductForCart}
            onViewProductDetails={onViewProductDetails}
          />
        )}
        {viewMode === "gallery" && (
          <GalleryView
            products={visibleProducts}
            onStartEdit={onStartEdit}
            onToggleStatus={onToggleStatus}
            onDeleteProduct={onDeleteProduct}
            onSelectProductForCart={onSelectProductForCart}
            onViewProductDetails={onViewProductDetails}
          />
        )}
        {viewMode === "detail" && (
          <DetailView
            products={visibleProducts}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProductId}
            onStartEdit={onStartEdit}
            onToggleStatus={onToggleStatus}
            onDeleteProduct={onDeleteProduct}
            onSelectProductForCart={onSelectProductForCart}
            onViewProductDetails={onViewProductDetails}
          />
        )}
        {viewMode === "bulk" && (
          <BulkView
            products={visibleProducts}
            selectedIds={selectedBulkIds}
            onToggleSelection={toggleBulkSelection}
            onStartEdit={onStartEdit}
            onToggleStatus={onToggleStatus}
            onDeleteProduct={onDeleteProduct}
            onSelectProductForCart={onSelectProductForCart}
            onViewProductDetails={onViewProductDetails}
          />
        )}
        {filteredProducts.length === 0 && (
          <p className="rounded-2xl bg-white p-5 text-sm text-[color:var(--muted)]">
            No products match the current search.
          </p>
        )}

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onGoToPage={goToPage}
        />
      </article>
      {previewImage && (
        <ImagePreviewDialog
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </section>
  );
}

type ProductActionsProps = {
  product: Product;
  compact?: boolean;
  onStartEdit: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSelectProductForCart: (id: string) => void;
  onViewProductDetails: (id: string) => void;
};

function ImageAttachmentList({
  images,
  onPreview,
  onRemove,
}: {
  images: string[];
  onPreview: (image: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="relative overflow-hidden rounded-xl border border-[color:var(--border)] bg-white"
        >
          <button
            className="block w-full transition duration-200 hover:opacity-90"
            type="button"
            onClick={() => onPreview(image)}
          >
            <img
              className="h-20 w-full object-cover"
              src={image}
              alt={`Attached product ${index + 1}`}
            />
          </button>
          <button
          data-testid={`btn-field-remove-image-${index}`}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white transition hover:bg-rose-700"
            type="button"
            aria-label="Remove image"
            onClick={() => onRemove(index)}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

function ImagePreviewDialog({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-5"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl rounded-[1.5rem] bg-white p-4 shadow-2xl">
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-rose-700"
          type="button"
          aria-label="Close image preview"
          onClick={onClose}
        >
          x
        </button>
        <img
          className="max-h-[75vh] w-full rounded-[1.2rem] object-contain"
          src={image}
          alt="Uploaded product preview"
        />
      </div>
    </div>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: ProductSortKey;
  onChange: (value: ProductSortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpen(false));
  const selected =
    sortOptions.find((option) => option.id === value)?.label ?? "Sort products";
  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-left text-sm font-semibold transition duration-200 hover:bg-slate-50"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected}</span>
        <span>v</span>
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-white p-2 shadow-xl">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition duration-200 hover:bg-slate-100 ${option.id === value ? "bg-slate-950 text-white hover:bg-slate-950" : ""}`}
              type="button"
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BulkSelectDropdown({
  products,
  selectedIds,
  onChange,
}: {
  products: Product[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpen(false));
  const visibleIds = products.map((product) => product.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  function toggleProduct(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  }
  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-left text-sm font-semibold transition duration-200 hover:bg-slate-50"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          {selectedIds.length
            ? `${selectedIds.length} selected`
            : "Bulk select"}
        </span>
        <span>v</span>
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-2 max-h-80 w-80 overflow-auto rounded-2xl border border-[color:var(--border)] bg-white p-3 shadow-xl">
          <div className="mb-2 flex gap-2">
            <button
              className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white transition duration-200 hover:bg-slate-800"
              type="button"
              onClick={() =>
                onChange(
                  allVisibleSelected
                    ? []
                    : Array.from(new Set([...selectedIds, ...visibleIds])),
                )
              }
            >
              {allVisibleSelected ? "Clear page" : "Select page"}
            </button>
            <button
              className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold transition duration-200 hover:bg-slate-100"
              type="button"
              onClick={() => onChange([])}
            >
              Clear all
            </button>
          </div>
          {products.map((product) => (
            <label
              key={product.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-slate-100"
            >
              <input
                className="h-4 w-4 accent-slate-950"
                type="checkbox"
                checked={selectedIds.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
              />
              <span>
                {product.name}
                <span className="ml-2 text-xs text-[color:var(--muted)]">
                  {product.productCode}
                </span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onGoToPage,
}: {
  currentPage: number;
  totalPages: number;
  onGoToPage: (page: number) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[color:var(--muted)]">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={currentPage === 1}
          onClick={() => onGoToPage(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              className={`h-10 w-10 rounded-full border text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${page === currentPage ? "border-slate-950 bg-slate-950 text-white hover:bg-slate-800" : "border-[color:var(--border)] bg-white hover:bg-slate-100"}`}
              type="button"
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onGoToPage(page)}
            >
              {page}
            </button>
          ),
        )}
        <button
          className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onGoToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function BulkToolbar({
  selectedCount,
  hasMixedStatuses,
  onToggle,
  onDelete,
  onAddToCart,
}: {
  selectedCount: number;
  hasMixedStatuses: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div className="mb-5 rounded-[1.25rem] border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>
          <strong>{selectedCount}</strong> selected.{" "}
          {hasMixedStatuses
            ? "Selection contains both Active and Draft products; toggle will invert each selected product status."
            : "Bulk actions apply to all selected products."}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-full bg-white px-4 py-2 font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-sm"
            type="button"
            onClick={onToggle}
          >
            Toggle Selected
          </button>
          <button
            className="rounded-full bg-white px-4 py-2 font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-sm"
            type="button"
            onClick={onAddToCart}
          >
            Add Selected to Cart
          </button>
          <button
            className="rounded-full bg-rose-700 px-4 py-2 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-rose-800 hover:shadow-lg"
            type="button"
            onClick={onDelete}
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}

function TableView(
  props: Omit<ProductActionsProps, "product" | "compact"> & {
    products: Product[];
  },
) {
  return (
    <div className="mb-6 overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[color:var(--surface-strong)] text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.products.map((product) => (
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
              <td className="px-4 py-3">${product.price}</td>
              <td className="px-4 py-3">{product.stock}</td>
              <td className="px-4 py-3">
                <StatusBadge status={product.status} />
              </td>
              <td className="px-4 py-3">
                <ProductActions product={product} {...props} compact />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function GridView(
  props: Omit<ProductActionsProps, "product"> & { products: Product[] },
) {
  return (
    <div className="grid gap-4">
      {props.products.map((product) => (
        <ProductCard key={product.id} product={product} {...props} />
      ))}
    </div>
  );
}
function ListView(
  props: Omit<ProductActionsProps, "product"> & { products: Product[] },
) {
  return (
    <div className="grid gap-3">
      {props.products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white p-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-[color:var(--muted)]">
              {product.productCode} | {product.category} | ${product.price} |{" "}
              {product.stock} in stock
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={product.status} />
            <ProductActions product={product} {...props} compact />
          </div>
        </div>
      ))}
    </div>
  );
}
function KanbanView(
  props: Omit<ProductActionsProps, "product"> & {
    activeProducts: Product[];
    draftProducts: Product[];
  },
) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <KanbanColumn title="Active" products={props.activeProducts} {...props} />
      <KanbanColumn title="Draft" products={props.draftProducts} {...props} />
    </div>
  );
}
function KanbanColumn(
  props: Omit<ProductActionsProps, "product"> & {
    title: Product["status"];
    products: Product[];
  },
) {
  return (
    <div className="rounded-[1.4rem] border border-dashed border-[color:var(--border)] bg-white p-4">
      <h3 className="font-semibold">{props.title}</h3>
      <div className="mt-4 grid gap-3">
        {props.products.map((product) => (
          <ProductCard key={product.id} product={product} {...props} />
        ))}
      </div>
    </div>
  );
}
function GalleryView(
  props: Omit<ProductActionsProps, "product"> & { products: Product[] },
) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {props.products.map((product) => (
        <div
          key={product.id}
          className="overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] bg-white"
        >
          <ProductImage product={product} className="h-40 w-full" />
          <div className="p-4">
            <ProductCard product={product} {...props} />
          </div>
        </div>
      ))}
    </div>
  );
}
function DetailView(
  props: Omit<ProductActionsProps, "product"> & {
    products: Product[];
    selectedProduct?: Product;
    onSelectProduct: (id: string) => void;
  },
) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="grid gap-2 rounded-[1.4rem] border border-[color:var(--border)] bg-white p-3">
        {props.products.map((product) => (
          <button
            key={product.id}
            className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${props.selectedProduct?.id === product.id ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-[color:var(--surface-strong)] hover:bg-slate-100"}`}
            type="button"
            onClick={() => props.onSelectProduct(product.id)}
          >
            {product.name}
          </button>
        ))}
      </div>
      {props.selectedProduct && (
        <ProductCard product={props.selectedProduct} {...props} />
      )}
    </div>
  );
}
function BulkView(
  props: Omit<ProductActionsProps, "product"> & {
    products: Product[];
    selectedIds: string[];
    onToggleSelection: (id: string) => void;
  },
) {
  return (
    <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-white p-4">
      <p className="mb-4 text-sm font-semibold text-[color:var(--muted)]">
        {props.selectedIds.length} selected for bulk action practice
      </p>
      <div className="grid gap-3">
        {props.products.map((product) => (
          <label
            key={product.id}
            className="flex flex-col gap-3 rounded-2xl bg-[color:var(--surface-strong)] p-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <span className="flex items-center gap-3">
              <input
                className="h-5 w-5 accent-slate-950"
                type="checkbox"
                checked={props.selectedIds.includes(product.id)}
                onChange={() => props.onToggleSelection(product.id)}
              />
              <span>
                <strong>{product.name}</strong>
                <br />
                <span className="text-sm text-[color:var(--muted)]">
                  {product.productCode} | {product.category}
                </span>
              </span>
            </span>
            <ProductActions product={product} {...props} compact />
          </label>
        ))}
      </div>
    </div>
  );
}
function ProductCard({ product, ...actions }: ProductActionsProps) {
  return (
    <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-white p-4">
      <ProductImage
        product={product}
        className="mb-4 h-36 w-full rounded-2xl"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-[color:var(--muted)]">
            {product.category} | ${product.price} | {product.stock} in stock
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
            {product.productCode}
          </p>
        </div>
        <StatusBadge status={product.status} />
      </div>
      <div className="mt-4">
        <ProductActions product={product} {...actions} />
      </div>
    </div>
  );
}

function ProductActions({
  product,
  compact,
  onStartEdit,
  onToggleStatus,
  onDeleteProduct,
  onSelectProductForCart,
  onViewProductDetails,
}: ProductActionsProps) {
  const sizeClass = compact ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="flex flex-wrap gap-2">
      <IconButton
        testId="row-button-view-details"
        label="View details"
        className={sizeClass}
        onClick={() => onViewProductDetails(product.id)}
        icon="view"
      />
      <IconButton
        testId="row-button-edit"
        label="Edit"
        className={sizeClass}
        onClick={() => onStartEdit(product)}
        icon="edit"
      />
      <IconButton
        testId="row-button-toggle-status"
        label="Toggle status"
        className={sizeClass}
        onClick={() => onToggleStatus(product)}
        icon="toggle"
      />
      <IconButton
        testId="row-button-delete"
        label="Delete"
        className={sizeClass}
        onClick={() => onDeleteProduct(product.id)}
        icon="delete"
        danger
      />
      <IconButton
        testId="row-button-add-to-cart"
        label="Add to Cart"
        className={sizeClass}
        onClick={() => onSelectProductForCart(product.id)}
        icon="cart"
      />
    </div>
  );
}

function IconButton({
  testId,
  label,
  icon,
  className,
  danger,
  onClick,
}: {
  testId: string;
  label: string;
  icon: "view" | "edit" | "toggle" | "delete" | "cart";
  className: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full border transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${className} ${danger ? "border-rose-200 text-rose-700 hover:bg-rose-700 hover:text-white" : "border-[color:var(--border)] text-slate-700 hover:bg-slate-950 hover:text-white"}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <ActionIcon icon={icon} />
    </button>
  );
}

function ActionIcon({
  icon,
}: {
  icon: "view" | "edit" | "toggle" | "delete" | "cart";
}) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (icon === "view")
    return (
      <svg {...common}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  if (icon === "edit")
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  if (icon === "toggle")
    return (
      <svg {...common}>
        <path d="M21 12a9 9 0 0 1-15.5 6.2" />
        <path d="M3 12A9 9 0 0 1 18.5 5.8" />
        <path d="M6 18H3v3" />
        <path d="M18 6h3V3" />
      </svg>
    );
  if (icon === "delete")
    return (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M6 6h15l-2 8H8Z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function toProductsCsv(products: Product[]) {
  return [
    "productCode,productName,category,price,stock,status",
    ...products.map((product) =>
      [
        product.productCode,
        product.name,
        product.category,
        product.price,
        product.stock,
        product.status,
      ].join(","),
    ),
  ].join("\n");
}

function ProductImage({
  product,
  className,
}: {
  product: Product;
  className: string;
}) {
  const image = product.images[0];
  if (!image) {
    return (
      <div
        className={`flex ${className} items-center justify-center bg-[color:var(--surface-strong)] text-2xl font-bold text-[color:var(--accent-strong)]`}
      >
        {product.name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      className={`${className} object-cover`}
      src={image}
      alt={product.name}
    />
  );
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
