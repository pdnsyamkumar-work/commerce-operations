"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LoginPanel } from "@/components/login-panel";
import { AppToast } from "@/components/commerce/app-toast";
import { CartPage } from "@/components/commerce/cart-page";
import { ConfirmDialog } from "@/components/commerce/confirm-dialog";
import { DashboardPage } from "@/components/commerce/dashboard-page";
import { InventoryPage } from "@/components/commerce/inventory-page";
import { ProductDetailsPage } from "@/components/commerce/product-details-page";
import { ProfilePage } from "@/components/commerce/profile-page";
import { ProductsPage } from "@/components/commerce/products-page";
import { ReportsPage } from "@/components/commerce/reports-page";
import { SupportPage } from "@/components/commerce/support-page";
import {
  validateProductDraft,
  type ProductFieldName,
} from "@/components/commerce/product-validation";
import { useClickOutside } from "@/components/commerce/shared";
import type {
  CommerceNavItem,
  ProductDraft,
  ProductFormErrors,
  TaskLane,
} from "@/components/commerce/types";
import type { CartItem, Product, User } from "@/lib/store";

const emptyDraft: ProductDraft = {
  productCode: "",
  name: "",
  category: "",
  price: "",
  stock: "",
  status: "Active",
  images: [],
};

const commerceNavItems: CommerceNavItem[] = [
  "Dashboard",
  "Products",
  "Inventory",
  "Cart",
  "Reports",
  "Support",
];
const defaultUploadSummary = "No inventory file uploaded yet.";
const defaultAuditChecks = ["pricing"];
const defaultFulfillmentChannels = ["Online Store"];
const defaultTaskBoard: Record<TaskLane, string[]> = {
  todo: ["Verify product price", "Review low-stock alert"],
  done: ["Confirm login access"],
};
const defaultProfileDetails = {
  countryCode: "+1",
  phone: "555 0100",
  title: "Commerce Admin",
  avatar: "",
};

const pageCopy: Record<
  CommerceNavItem,
  { eyebrow: string; title: string; description: string }
> = {
  Dashboard: {
    eyebrow: "Commerce Operations",
    title: "Manage products, inventory, and cart activity from one dashboard.",
    description:
      "Track catalog, inventory, and cart signals before starting detailed work.",
  },
  Products: {
    eyebrow: "Product Management",
    title: "Create and maintain products with clear catalog controls.",
    description:
      "Add items, update publishing status, and remove discontinued products.",
  },
  Inventory: {
    eyebrow: "Inventory Control",
    title: "Monitor stock health across every product.",
    description:
      "Review stock levels, identify low-stock products, and track draft items.",
  },
  Cart: {
    eyebrow: "Cart Operations",
    title: "Validate cart contents and quantity changes.",
    description:
      "Add selected products, update quantities, and remove cart items.",
  },
  Reports: {
    eyebrow: "Operations Reports",
    title: "Review catalog and cart performance snapshots.",
    description:
      "Validate totals, active products, draft products, and cart value.",
  },
  Support: {
    eyebrow: "Support Center",
    title: "Get help with catalog, inventory, and cart operations.",
    description:
      "Practice support requests, help topics, and service workflows.",
  },
  Profile: {
    eyebrow: "User Profile",
    title: "Manage your personal workspace details.",
    description: "Update contact information, role details, and profile photo.",
  },
  "Product Details": {
    eyebrow: "Product Details",
    title: "Review one catalog item in detail.",
    description:
      "Inspect pricing, stock, status, and available product actions.",
  },
};

const maxInventoryUploadSizeMb = 1;
const maxInventoryUploadSizeBytes = maxInventoryUploadSizeMb * 1024 * 1024;
const inventoryTemplate =
  "productCode,productName,category,price,stock,reorderLevel,status\nPRD-101,Canvas Weekender Bag,Travel,84,12,5,Active";
const inventoryTemplateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(inventoryTemplate)}`;

type ConfirmationState = {
  title: string;
  description: string;
  highlightText?: string;
  confirmLabel: string;
  onConfirm: () => void;
};

type InventoryUploadRow = {
  productCode: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  status: Product["status"];
};

function parseCsvLine(line: string) {
  return line.split(",").map((cell) => cell.trim());
}

function parseInventoryUpload(contents: string): {
  rows: InventoryUploadRow[];
  error?: string;
} {
  const lines = contents
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      rows: [],
      error:
        "Inventory CSV must include a header row and at least one product row.",
    };
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  const getIndex = (key: string) => headers.indexOf(key.toLowerCase());
  const requiredColumns = [
    "productCode",
    "productName",
    "category",
    "stock",
    "status",
  ];
  const missingColumn = requiredColumns.find(
    (column) => getIndex(column) === -1,
  );

  if (missingColumn) {
    return {
      rows: [],
      error: `Inventory CSV is missing required column: ${missingColumn}.`,
    };
  }

  const priceIndex = getIndex("price");
  const rows: InventoryUploadRow[] = [];

  for (const [rowIndex, line] of lines.slice(1).entries()) {
    const cells = parseCsvLine(line);
    const productCode = cells[getIndex("productCode")]?.trim();
    const productName = cells[getIndex("productName")]?.trim();
    const category = cells[getIndex("category")]?.trim();
    const price =
      priceIndex === -1 || !cells[priceIndex] ? 1 : Number(cells[priceIndex]);
    const stock = Number(cells[getIndex("stock")]);
    const statusValue = cells[getIndex("status")]?.trim().toLowerCase();

    if (!productCode || !productName || !category) {
      return {
        rows: [],
        error: `Row ${rowIndex + 2} must include productCode, productName, and category.`,
      };
    }

    if (!Number.isFinite(price) || price < 1) {
      return { rows: [], error: `Row ${rowIndex + 2} has an invalid price.` };
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return {
        rows: [],
        error: `Row ${rowIndex + 2} has an invalid stock value.`,
      };
    }

    rows.push({
      productCode,
      productName,
      category,
      price,
      stock,
      status: statusValue === "draft" ? "Draft" : "Active",
    });
  }

  return { rows };
}

export function CommerceWorkspace() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [activeView, setActiveView] = useState<CommerceNavItem>("Dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [productErrors, setProductErrors] = useState<ProductFormErrors>({});
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("Loading dashboard data...");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [uploadSummary, setUploadSummary] =
    useState<string>(defaultUploadSummary);
  const [selectedAuditChecks, setSelectedAuditChecks] =
    useState<string[]>(defaultAuditChecks);
  const [shippingPriority, setShippingPriority] = useState("standard");
  const [fulfillmentChannels, setFulfillmentChannels] = useState<string[]>(
    defaultFulfillmentChannels,
  );
  const [selectedLabCategory, setSelectedLabCategory] = useState("");
  const [selectedLabProductId, setSelectedLabProductId] = useState("");
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [taskBoard, setTaskBoard] = useState<Record<TaskLane, string[]>>({
    todo: ["Verify product price", "Review low-stock alert"],
    done: ["Confirm login access"],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [riskScore, setRiskScore] = useState("45");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(
    null,
  );
  const [selectedDetailProductId, setSelectedDetailProductId] =
    useState<string>("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const [profileDetails, setProfileDetails] = useState(defaultProfileDetails);
  useClickOutside(profileDropdownRef, () => setIsProfileOpen(false));

  function notify(nextMessage: string) {
    setMessage(nextMessage);
    setIsToastVisible(true);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  }

  async function refresh() {
    const [productResponse, cartResponse] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/cart-items"),
    ]);
    const productData = await productResponse.json();
    const cartData = await cartResponse.json();
    setProducts(productData.products);
    setCartItems(cartData.items);
    setSelectedProductId(
      (current) => current || productData.products[0]?.id || "",
    );
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialState() {
      try {
        const sessionResponse = await fetch("/api/auth/session");
        const sessionData = (await sessionResponse.json()) as {
          user: User | null;
        };

        if (!isMounted) return;

        if (!sessionData.user) {
          setIsCheckingSession(false);
          return;
        }

        setUser(sessionData.user);
        const [productResponse, cartResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/cart-items"),
        ]);
        const productData = await productResponse.json();
        const cartData = await cartResponse.json();

        if (!isMounted) return;

        setProducts(productData.products);
        setCartItems(cartData.items);
        setSelectedProductId(productData.products[0]?.id || "");
        notify("Dashboard data loaded.");
        setIsCheckingSession(false);
      } catch {
        if (isMounted) {
          notify("Could not load dashboard data.");
          setIsCheckingSession(false);
        }
      }
    }

    void loadInitialState();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAuthenticated(authenticatedUser: User) {
    setUser(authenticatedUser);
    await refresh();
    notify("Dashboard data loaded.");
  }

  function saveProfile(updates: {
    name: string;
    email: string;
    profile: {
      countryCode: string;
      phone: string;
      title: string;
      avatar: string;
    };
  }) {
    setUser((current) =>
      current
        ? { ...current, name: updates.name, email: updates.email }
        : current,
    );
    setProfileDetails(updates.profile);
    notify("Profile updated.");
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProducts([]);
    setCartItems([]);
    setDraft(emptyDraft);
    setEditingProductId(null);
    setProductErrors({});
    notify("Signed out.");
  }

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
      ),
    [cartItems],
  );
  const activeProducts = useMemo(
    () => products.filter((product) => product.status === "Active"),
    [products],
  );
  const draftProducts = useMemo(
    () => products.filter((product) => product.status === "Draft"),
    [products],
  );
  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= 10),
    [products],
  );
  const productCategories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  );
  const labProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          !selectedLabCategory || product.category === selectedLabCategory,
      ),
    [products, selectedLabCategory],
  );
  const selectedLabProduct = useMemo(
    () => products.find((product) => product.id === selectedLabProductId),
    [products, selectedLabProductId],
  );
  const selectedDetailProduct = useMemo(
    () => products.find((product) => product.id === selectedDetailProductId),
    [products, selectedDetailProductId],
  );
  const content = pageCopy[activeView];

  function resetProductForm() {
    setDraft(emptyDraft);
    setEditingProductId(null);
    setProductErrors({});
  }

  function navigateToView(nextView: CommerceNavItem) {
    if (nextView !== "Products") {
      resetProductForm();
    }

    setActiveView(nextView);
  }

  function updateDraft(patch: Partial<ProductDraft>, field?: ProductFieldName) {
    setDraft((current) => {
      const nextDraft = { ...current, ...patch };

      if (field) {
        const nextErrors = validateProductDraft(nextDraft);
        setProductErrors((currentErrors) => {
          const next = { ...currentErrors };
          const fieldError = nextErrors[field];

          if (fieldError) {
            next[field] = fieldError;
          } else {
            delete next[field];
          }

          return next;
        });
      }

      return nextDraft;
    });
  }

  function startEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductErrors({});
    setDraft({
      productCode: product.productCode,
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
      images: product.images,
    });
    notify(`Editing ${product.name}.`);
  }

  function cancelEditProduct() {
    resetProductForm();
    notify("Product edit cancelled.");
  }

  function validateDraftField(field: ProductFieldName) {
    setProductErrors((current) => {
      const nextErrors = validateProductDraft(draft);
      const next = { ...current };
      const fieldError = nextErrors[field];

      if (fieldError) {
        next[field] = fieldError;
      } else {
        delete next[field];
      }

      return next;
    });
  }

  function toggleAuditCheck(id: string) {
    setSelectedAuditChecks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function updateFulfillmentChannels(channels: string[]) {
    setFulfillmentChannels(channels);
  }

  function handleCategoryChange(category: string) {
    setSelectedLabCategory(category);
    const firstProduct = products.find(
      (product) => !category || product.category === category,
    );
    setSelectedLabProductId(firstProduct?.id ?? "");
  }

  function moveTask(task: string, targetLane: TaskLane) {
    setTaskBoard((current) => {
      const nextBoard: Record<TaskLane, string[]> = {
        todo: current.todo.filter((item) => item !== task),
        done: current.done.filter((item) => item !== task),
      };
      nextBoard[targetLane] = [...nextBoard[targetLane], task];
      return nextBoard;
    });
    setDraggedTask(null);
    notify(
      `Moved "${task}" to ${targetLane === "done" ? "Done" : "To do"}.`,
    );
  }

  function submitPracticeReview() {
    setIsDialogOpen(false);
    notify(
      `Review submitted for ${selectedLabProduct?.name ?? "selected product"}.`,
    );
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateProductDraft(draft);
    setProductErrors(errors);

    if (Object.keys(errors).length > 0) {
      notify("Fix the highlighted product fields before saving.");
      return;
    }

    const payload = {
      productCode: draft.productCode.trim(),
      name: draft.name.trim(),
      category: draft.category.trim(),
      price: Number(draft.price),
      stock: Number(draft.stock),
      status: draft.status,
      images: draft.images,
    };
    const response = await fetch(
      editingProductId ? `/api/products/${editingProductId}` : "/api/products",
      {
        method: editingProductId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409 && data.message) {
        setProductErrors((current) => ({
          ...current,
          productCode: String(data.message),
        }));
      }
      notify(data.message ?? "Could not save product.");
      return;
    }

    setDraft(emptyDraft);
    setEditingProductId(null);
    setProductErrors({});
    notify(
      `${editingProductId ? "Updated" : "Created"} ${data.product.name}.`,
    );
    await refresh();
  }

  async function toggleStatus(product: Product) {
    const nextStatus: Product["status"] =
      product.status === "Active" ? "Draft" : "Active";
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      notify("Could not update status.");
      return;
    }

    notify(`Updated ${product.name} to ${nextStatus}.`);
    await refresh();
  }

  function requestDeleteProduct(id: string) {
    const product = products.find((item) => item.id === id);
    setConfirmation({
      title: "Delete product?",
      description: `This will delete ${product?.name ?? "this product"} and remove any linked cart items. This action cannot be undone.`,
      highlightText: product?.name,
      confirmLabel: "Delete Product",
      onConfirm: () => void deleteProduct(id),
    });
  }

  async function deleteProduct(id: string) {
    setConfirmation(null);
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      notify("Could not delete product.");
      return;
    }

    if (editingProductId === id) cancelEditProduct();
    notify("Deleted product and any linked cart entries.");
    await refresh();
  }

  async function addToCart() {
    if (!selectedProductId) {
      notify("Select a product before adding it to the cart.");
      return;
    }

    const response = await fetch("/api/cart-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedProductId, quantity: 1 }),
    });
    const data = await response.json();

    if (!response.ok) {
      notify(data.message ?? "Could not add item to cart.");
      return;
    }

    notify(`Added ${data.item.name} to cart.`);
    await refresh();
  }

  async function updateQuantity(id: string, quantity: number) {
    const response = await fetch(`/api/cart-items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      notify("Could not update quantity.");
      return;
    }

    notify("Cart quantity updated.");
    await refresh();
  }

  function requestRemoveCartItem(id: string) {
    const item = cartItems.find((entry) => entry.id === id);
    setConfirmation({
      title: "Remove item from cart?",
      description: `This will remove ${item?.name ?? "this item"} from the cart.`,
      highlightText: item?.name,
      confirmLabel: "Remove Item",
      onConfirm: () => void removeCartItem(id),
    });
  }

  async function removeCartItem(id: string) {
    setConfirmation(null);
    const response = await fetch(`/api/cart-items/${id}`, { method: "DELETE" });

    if (!response.ok) {
      notify("Could not remove cart item.");
      return;
    }

    notify("Removed item from cart.");
    await refresh();
  }

  function selectProductForCart(productId: string) {
    setSelectedProductId(productId);
    navigateToView("Cart");
    notify("Product selected for cart flow.");
  }

  function viewProductDetails(productId: string) {
    setSelectedDetailProductId(productId);
    navigateToView("Product Details");
  }

  function editProductFromDetails(product: Product) {
    startEditProduct(product);
    navigateToView("Products");
  }

  async function addProductToCart(productId: string) {
    const response = await fetch("/api/cart-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    return response.ok;
  }

  function requestBulkDeleteProducts(selectedProducts: Product[]) {
    if (selectedProducts.length === 0) return;
    setConfirmation({
      title: "Delete selected products?",
      description: `This will delete ${selectedProducts.length} selected products and remove linked cart items. This action cannot be undone.`,
      confirmLabel: "Delete Selected",
      onConfirm: () => void bulkDeleteProducts(selectedProducts),
    });
  }

  async function bulkDeleteProducts(selectedProducts: Product[]) {
    setConfirmation(null);
    for (const product of selectedProducts) {
      await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    }
    notify(`Deleted ${selectedProducts.length} selected products.`);
    await refresh();
  }

  async function bulkToggleProducts(selectedProducts: Product[]) {
    if (selectedProducts.length === 0) return;
    const hasMixedStatuses =
      new Set(selectedProducts.map((product) => product.status)).size > 1;
    for (const product of selectedProducts) {
      const nextStatus: Product["status"] =
        product.status === "Active" ? "Draft" : "Active";
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    }
    notify(
      hasMixedStatuses
        ? "Selected products had both Active and Draft statuses; each status was inverted."
        : "Selected product statuses were toggled.",
    );
    await refresh();
  }

  async function bulkAddToCart(selectedProducts: Product[]) {
    if (selectedProducts.length === 0) return;
    for (const product of selectedProducts) {
      await addProductToCart(product.id);
    }
    notify(`Added ${selectedProducts.length} selected products to cart.`);
    await refresh();
  }

  async function uploadInventoryFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadSummary("No inventory file selected.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      const summary = "Unsupported file format. Upload a CSV file only.";
      setUploadSummary(summary);
      notify(summary);
      event.target.value = "";
      return;
    }

    if (file.size > maxInventoryUploadSizeBytes) {
      const summary = `File is too large. Maximum upload size is ${maxInventoryUploadSizeMb} MB.`;
      setUploadSummary(summary);
      notify(summary);
      event.target.value = "";
      return;
    }

    const uploadResult = parseInventoryUpload(await file.text());

    if (uploadResult.error) {
      const summary = uploadResult.error;
      setUploadSummary(summary);
      notify(summary);
      event.target.value = "";
      return;
    }

    for (const row of uploadResult.rows) {
      const payload = {
        productCode: row.productCode,
        name: row.productName,
        category: row.category,
        price: row.price,
        stock: row.stock,
        status: row.status,
        images: [],
      };
      const existingProduct = products.find(
        (product) =>
          product.productCode.toLowerCase() === row.productCode.toLowerCase(),
      );
      const response = await fetch(
        existingProduct
          ? `/api/products/${existingProduct.id}`
          : "/api/products",
        {
          method: existingProduct ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        const summary = data.message ?? `Could not import ${row.productCode}.`;
        setUploadSummary(summary);
        notify(summary);
        event.target.value = "";
        return;
      }
    }

    const summary = `Imported ${uploadResult.rows.length} inventory rows from ${file.name}.`;
    setUploadSummary(summary);
    notify(summary);
    await refresh();
    event.target.value = "";
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="rounded-full bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--muted)] shadow-sm">
          Checking session...
        </p>
      </main>
    );
  }

  if (!user) {
    return <LoginPanel onAuthenticated={handleAuthenticated} />;
  }

  return (
    <main className="flex min-h-screen w-full text-slate-900">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 rounded-r-[2rem] bg-white p-5 shadow-[16px_0_60px_rgba(15,23,42,0.08)] transition-all duration-300 lg:block ${isSideNavCollapsed ? "w-24" : "w-72"}`}
      >
        <div
          className={`mb-8 flex items-center ${isSideNavCollapsed ? "justify-center" : "justify-between gap-3"}`}
        >
          {!isSideNavCollapsed && (
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <span className="text-[color:var(--accent)]">Commerce</span>
              <span className="text-emerald-600">Ops</span>
            </div>
          )}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-white text-slate-700 transition duration-200 hover:bg-slate-100"
            type="button"
            aria-label={
              isSideNavCollapsed
                ? "Expand side navigation"
                : "Collapse side navigation"
            }
            onClick={() => setIsSideNavCollapsed((current) => !current)}
          >
            {isSideNavCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        </div>
        <nav className="grid gap-2" aria-label="Commerce navigation">
          {commerceNavItems.map((item) => {
            const active = item === activeView;
            return (
              <button
                key={item}
                title={item}
                className={`flex items-center rounded-full px-4 py-3 text-left text-sm font-semibold transition duration-200 ${isSideNavCollapsed ? "justify-center" : "gap-3"} ${active ? "bg-[color:var(--accent)] text-white shadow-sm" : "text-slate-600 hover:bg-[color:var(--surface-strong)]"}`}
                type="button"
                onClick={() => navigateToView(item)}
              >
                <span className="text-lg">{navIcon(item)}</span>
                {!isSideNavCollapsed && <span>{item}</span>}
              </button>
            );
          })}
        </nav>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
        <header className="relative z-40 flex flex-col gap-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p data-testid="Commerce Admin Title" className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
              Commerce Admin
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Catalog, inventory, and cart operations for {user.name}
            </p>
          </div>
          <div ref={profileDropdownRef} className="relative z-50">
            <button
              className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
              type="button"
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-white">
                {profileDetails.avatar ? (
                  <img
                    className="h-full w-full object-cover"
                    src={profileDetails.avatar}
                    alt={user.name}
                  />
                ) : (
                  user.name.slice(0, 1)
                )}
              </span>
              <span>{user.name}</span>
              <span>v</span>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[color:var(--border)] bg-white p-3 shadow-xl">
                <p className="px-3 py-2 text-sm font-semibold">{user.name}</p>
                <p className="px-3 pb-3 text-xs text-[color:var(--muted)]">
                  {user.email}
                </p>
                <button
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100"
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigateToView("Profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-700 transition duration-200 hover:bg-rose-50"
                  type="button"
                  onClick={signOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[0_24px_80px_rgba(78,52,35,0.12)] backdrop-blur lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
                {content.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                {content.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
                {content.description}
              </p>
            </div>
            <div className="grid min-w-[320px] gap-3 rounded-[1.5rem] bg-[color:var(--surface-strong)] p-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <SummaryTile
                label="Products"
                value={products.length.toString()}
              />
              <SummaryTile
                label="Cart Items"
                value={cartItems.length.toString()}
              />
              <SummaryTile label="Cart Total" value={`$${cartTotal}`} />
            </div>
          </div>
        </section>

        {activeView === "Dashboard" && (
          <DashboardPage
            activeProducts={activeProducts}
            draftProducts={draftProducts}
            lowStockProducts={lowStockProducts}
            cartTotal={cartTotal}
            onNavigate={navigateToView}
          />
        )}
        {activeView === "Inventory" && (
          <InventoryPage
            products={products}
            lowStockProducts={lowStockProducts}
            uploadSummary={uploadSummary}
            maxUploadSizeMb={maxInventoryUploadSizeMb}
            templateHref={inventoryTemplateHref}
            onUploadInventoryFile={uploadInventoryFile}
          />
        )}
        {activeView === "Reports" && (
          <ReportsPage
            products={products}
            cartItemsCount={cartItems.length}
            activeProducts={activeProducts}
            draftProducts={draftProducts}
            lowStockProducts={lowStockProducts}
            cartTotal={cartTotal}
            productCategories={productCategories}
            filteredProducts={labProducts}
            selectedCategory={selectedLabCategory}
            selectedProductId={selectedLabProductId}
            selectedProduct={selectedLabProduct}
            selectedAuditChecks={selectedAuditChecks}
            fulfillmentChannels={fulfillmentChannels}
            shippingPriority={shippingPriority}
            deliveryDate={deliveryDate}
            riskScore={riskScore}
            notificationsEnabled={notificationsEnabled}
            taskBoard={taskBoard}
            draggedTask={draggedTask}
            onToggleAuditCheck={toggleAuditCheck}
            onFulfillmentChannelsChange={updateFulfillmentChannels}
            onCategoryChange={handleCategoryChange}
            onSelectedProductChange={setSelectedLabProductId}
            onShippingPriorityChange={setShippingPriority}
            onDeliveryDateChange={setDeliveryDate}
            onRiskScoreChange={setRiskScore}
            onNotificationsEnabledChange={setNotificationsEnabled}
            onOpenReviewDialog={() => setIsDialogOpen(true)}
            onTaskDragStart={setDraggedTask}
            onMoveTask={moveTask}
          />
        )}
        {activeView === "Products" && (
          <ProductsPage
            products={products}
            draft={draft}
            errors={productErrors}
            editingProductId={editingProductId}
            onDraftChange={updateDraft}
            onDraftFieldBlur={validateDraftField}
            onSubmitProduct={submitProduct}
            onCancelEdit={cancelEditProduct}
            onStartEdit={startEditProduct}
            onToggleStatus={toggleStatus}
            onDeleteProduct={requestDeleteProduct}
            onSelectProductForCart={selectProductForCart}
            onViewProductDetails={viewProductDetails}
            onBulkToggleStatus={bulkToggleProducts}
            onBulkDeleteProducts={requestBulkDeleteProducts}
            onBulkAddToCart={bulkAddToCart}
          />
        )}
        {activeView === "Support" && <SupportPage />}
        {activeView === "Profile" && (
          <ProfilePage
            user={user}
            profile={profileDetails}
            onSave={saveProfile}
          />
        )}
        {activeView === "Product Details" && (
          <ProductDetailsPage
            product={selectedDetailProduct}
            onBackToProducts={() => navigateToView("Products")}
            onEdit={editProductFromDetails}
            onAddToCart={selectProductForCart}
          />
        )}
        {activeView === "Cart" && (
          <CartPage
            products={products}
            cartItems={cartItems}
            selectedProductId={selectedProductId}
            cartTotal={cartTotal}
            onSelectedProductChange={setSelectedProductId}
            onAddToCart={addToCart}
            onRemoveCartItem={requestRemoveCartItem}
            onUpdateQuantity={updateQuantity}
          />
        )}

        {confirmation && (
          <ConfirmDialog
            title={confirmation.title}
            description={confirmation.description}
            highlightText={confirmation.highlightText}
            confirmLabel={confirmation.confirmLabel}
            onCancel={() => setConfirmation(null)}
            onConfirm={confirmation.onConfirm}
          />
        )}

        {isDialogOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
          >
            <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl">
              <h2 id="review-dialog-title" className="text-2xl font-semibold">
                Submit product review?
              </h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                This confirms the selected checklist, fulfillment channels,
                shipping priority, and risk score for{" "}
                {selectedLabProduct?.name ?? "the selected product"}.
              </p>
              <div className="mt-5 rounded-[1.25rem] bg-[color:var(--surface-strong)] p-4 text-sm">
                <p>
                  Channels: {fulfillmentChannels.join(", ") || "None selected"}
                </p>
                <p>Priority: {shippingPriority}</p>
                <p>Risk score: {riskScore}</p>
              </div>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                  type="button"
                  onClick={submitPracticeReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        <AppToast
          message={message}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
        />
      </section>
    </main>
  );
}

function CollapseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function navIcon(item: CommerceNavItem) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (item === "Dashboard")
    return (
      <svg {...common}>
        <path d="M3 13h8V3H3z" />
        <path d="M13 21h8v-8h-8z" />
        <path d="M13 3h8v6h-8z" />
        <path d="M3 21h8v-6H3z" />
      </svg>
    );
  if (item === "Products")
    return (
      <svg {...common}>
        <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z" />
        <path d="M3.3 7 12 12l8.7-5" />
        <path d="M12 22V12" />
      </svg>
    );
  if (item === "Inventory")
    return (
      <svg {...common}>
        <path d="M4 4h16v5H4z" />
        <path d="M6 9v11h12V9" />
        <path d="M9 13h6" />
      </svg>
    );
  if (item === "Cart")
    return (
      <svg {...common}>
        <path d="M6 6h15l-2 8H8Z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
    );
  if (item === "Reports")
    return (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
      </svg>
    );
  if (item === "Support")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.2-2.9 1.5-2.9 3" />
        <path d="M12 17h.01" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  );
}

