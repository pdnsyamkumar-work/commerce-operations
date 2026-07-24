import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";

export type Product = {
  id: string;
  productCode: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft";
  images: string[];
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator";
};

type ProductInput = Omit<Product, "id"> & { id?: string };
type ProductPatch = Partial<Omit<ProductInput, "productCode">>;
type CartItemInput = Omit<CartItem, "id" | "name" | "unitPrice">;
type PrivateUser = User & { password: string; storeName?: string };
type UserInput = Omit<PrivateUser, "id" | "role"> & { role?: User["role"] };
type SeedProduct = Omit<Product, "productCode" | "images"> & {
  imageBadges: Array<{ label: string; color: string }>;
};

declare global {
  var __commerceRuntimeInitialized: boolean | undefined;
}

const runtimeDir = path.join(process.cwd(), ".runtime-data");
const dataDir = path.join(process.cwd(), "src", "data");

const runtimeProductsPath = path.join(runtimeDir, "products.json");
const runtimeCartItemsPath = path.join(runtimeDir, "cart-items.json");
const runtimeUsersPath = path.join(runtimeDir, "users.json");

function resetRuntimeDataOnce() {
  if (globalThis.__commerceRuntimeInitialized) {
    return;
  }

  rmSync(runtimeDir, { recursive: true, force: true });
  globalThis.__commerceRuntimeInitialized = true;
}

resetRuntimeDataOnce();

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const productImage = (label: string, color: string) => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260"><rect width="420" height="260" rx="28" fill="' +
    color +
    '"/><circle cx="340" cy="60" r="46" fill="rgba(255,255,255,0.22)"/><circle cx="80" cy="210" r="58" fill="rgba(255,255,255,0.18)"/><text x="40" y="135" fill="white" font-family="Arial" font-size="34" font-weight="700">' +
    label +
    "</text></svg>";
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function writeRuntimeFile<T>(filePath: string, value: T) {
  mkdirSync(runtimeDir, { recursive: true });
  writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function readDefaultProducts(): Product[] {
  const products = readJsonFile<SeedProduct[]>(
    path.join(dataDir, "default-products.json"),
    [],
  );
  return products.map(({ imageBadges, ...product }) =>
    normalizeProduct({
      ...product,
      productCode: product.id,
      images: imageBadges.map((badge) =>
        productImage(badge.label, badge.color),
      ),
    }),
  );
}

function readProducts() {
  return readJsonFile<Product[]>(runtimeProductsPath, readDefaultProducts()).map(
    normalizeProduct,
  );
}

function writeProducts(products: Product[]) {
  writeRuntimeFile(
    runtimeProductsPath,
    products.map(normalizeProduct),
  );
}

function readCartItems() {
  return readJsonFile<CartItem[]>(
    runtimeCartItemsPath,
    readJsonFile<CartItem[]>(path.join(dataDir, "default-cart-items.json"), []),
  );
}

function writeCartItems(items: CartItem[]) {
  writeRuntimeFile(runtimeCartItemsPath, items);
}

function readUsers() {
  return readJsonFile<PrivateUser[]>(
    runtimeUsersPath,
    readJsonFile<PrivateUser[]>(path.join(dataDir, "default-users.json"), []),
  );
}

function writeUsers(users: PrivateUser[]) {
  writeRuntimeFile(runtimeUsersPath, users);
}

const toPublicUser = (user: PrivateUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

function normalizeProduct(product: {
  id: string;
  productCode?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: Product["status"];
  images: string[];
}): Product {
  return {
    ...product,
    productCode: product.productCode ?? product.id,
  };
}

export const db = {
  authenticateUser(email: string, password: string) {
    const user = readUsers().find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password,
    );

    return user ? toPublicUser(user) : null;
  },
  getUser(id: string) {
    const user = readUsers().find((item) => item.id === id);
    return user ? toPublicUser(user) : null;
  },
  createUser(input: UserInput) {
    const users = readUsers();
    const emailExists = users.some(
      (item) => item.email.toLowerCase() === input.email.toLowerCase(),
    );

    if (emailExists) {
      return { error: "A user with this email already exists." as const };
    }

    const user: PrivateUser = {
      id: createId("usr"),
      name: input.name,
      email: input.email,
      password: input.password,
      storeName: input.storeName,
      role: input.role ?? "operator",
    };

    users.push(user);
    writeUsers(users);
    return { user: toPublicUser(user) };
  },
  listProducts() {
    return readProducts();
  },
  createProduct(input: ProductInput) {
    const products = readProducts();
    const { id, productCode, ...productInput } = input;
    const nextProductCode = productCode.trim();

    if (!nextProductCode) {
      return { error: "Product code is required." as const };
    }

    const duplicate = products.some(
      (item) =>
        item.productCode.toLowerCase() === nextProductCode.toLowerCase(),
    );

    if (duplicate) {
      return { error: "A product with this code already exists." as const };
    }

    const product = normalizeProduct({
      id: id ?? nextProductCode,
      productCode: nextProductCode,
      ...productInput,
    });
    products.unshift(product);
    writeProducts(products);
    return product;
  },
  updateProduct(id: string, patch: ProductPatch) {
    const products = readProducts();
    const product = products.find((item) => item.id === id);
    if (!product) {
      return null;
    }

    Object.assign(product, patch);
    writeProducts(products);
    return product;
  },
  deleteProduct(id: string) {
    const products = readProducts();
    const index = products.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    products.splice(index, 1);
    writeProducts(products);
    writeCartItems(readCartItems().filter((item) => item.productId !== id));
    return true;
  },
  getProduct(id: string) {
    return readProducts().find((item) => item.id === id) ?? null;
  },
  listCartItems() {
    return readCartItems();
  },
  createCartItem(input: CartItemInput) {
    const products = readProducts();
    const cartItems = readCartItems();
    const product = products.find((item) => item.id === input.productId);
    if (!product) {
      return { error: "Product not found." as const };
    }

    const existing = cartItems.find(
      (item) => item.productId === input.productId,
    );
    if (existing) {
      existing.quantity += input.quantity;
      writeCartItems(cartItems);
      return { item: existing };
    }

    const item = {
      id: createId("cart"),
      productId: product.id,
      name: product.name,
      quantity: input.quantity,
      unitPrice: product.price,
    };
    cartItems.unshift(item);
    writeCartItems(cartItems);
    return { item };
  },
  updateCartItem(id: string, quantity: number) {
    const cartItems = readCartItems();
    const item = cartItems.find((entry) => entry.id === id);
    if (!item) {
      return null;
    }

    item.quantity = quantity;
    writeCartItems(cartItems);
    return item;
  },
  deleteCartItem(id: string) {
    const cartItems = readCartItems();
    const index = cartItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    cartItems.splice(index, 1);
    writeCartItems(cartItems);
    return true;
  },
};
