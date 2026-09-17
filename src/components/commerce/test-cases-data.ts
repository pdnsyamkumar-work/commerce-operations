export type TestCaseType = "UI" | "API";
export type TestCasePriority = "P0" | "P1" | "P2";
export type TestScope = "Functional" | "E2E";
export type AutomationEligibility = "Automatable" | "Ignored / Covered by E2E";

export type FeatureArea =
  | "Authentication"
  | "Products"
  | "Inventory"
  | "Cart"
  | "Reports"
  | "Support"
  | "Profile";

export type TestStep = {
  step: number;
  action: string;
  expectedResult: string;
};

export type BddScenario = {
  given: string[];
  when: string[];
  then: string[];
  and?: string[];
};

export type DataDrivenRow = {
  scenario: string;
  inputs: Record<string, string | number | boolean>;
  expected: string;
};

export type UiTestDataGroup = {
  title: string;
  items: Array<{ label: string; value: string }>;
};

export type ApiTestData = {
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  requestBody?: Record<string, unknown>;
};

export type NetworkMockDetails = {
  routePattern: string;
  mockStatus: number;
  behavior: string;
};

export type TestCase = {
  id: string;
  title: string;
  feature: FeatureArea;
  coveredFeatures?: FeatureArea[];
  scope: TestScope;
  type: TestCaseType;
  priority: TestCasePriority;
  automationEligibility: AutomationEligibility;
  ignoredReason?: string;
  isNetworkMockOrIntercept?: boolean;
  mockDetails?: NetworkMockDetails;
  description: string;
  endpointOrRoute: string;
  preconditions?: string[];
  steps: TestStep[];
  bddScenario: BddScenario;
  dataDrivenDataset: DataDrivenRow[];
  uiTestData?: UiTestDataGroup;
  apiTestData?: ApiTestData;
  targetElements?: string[];
  automationTool: string;
};

export const testCasesData: TestCase[] = [
  // =========================================================================
  // 1. AUTHENTICATION
  // =========================================================================
  {
    id: "TC-AUTH-UI-001",
    title: "Successful Sign-In with Valid Admin Credentials",
    feature: "Authentication",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify an administrator can authenticate with valid credentials and access the workspace dashboard.",
    endpointOrRoute: "Route: / (Sign In)",
    preconditions: ["Clean session without active session cookie."],
    steps: [
      {
        step: 1,
        action: "Navigate to root application URL (/).",
        expectedResult: "Sign in form renders with email and password inputs.",
      },
      {
        step: 2,
        action: "Enter valid admin email and password.",
        expectedResult: "Inputs accept values without validation errors.",
      },
      {
        step: 3,
        action: "Click 'Sign In to Workspace' submit button.",
        expectedResult: "Welcome toast appears; workspace dashboard loads.",
      },
    ],
    bddScenario: {
      given: [
        "User is on the login page",
        "User has valid administrator credentials",
      ],
      when: ["User enters email and password", "User submits the sign-in form"],
      then: [
        "Authentication succeeds",
        "User is redirected to the workspace dashboard",
      ],
      and: ["A welcome toast notification is displayed"],
    },
    dataDrivenDataset: [
      {
        scenario: "Admin User",
        inputs: { email: "admin@commerce.test", password: "Commerce@123" },
        expected: "200 OK, Redirect to dashboard",
      },
      {
        scenario: "Ops Manager",
        inputs: { email: "manager@commerce.test", password: "Manager@123" },
        expected: "200 OK, Redirect to dashboard",
      },
    ],
    uiTestData: {
      title: "Valid Login Data",
      items: [
        { label: "Email", value: "admin@commerce.test" },
        { label: "Password", value: "Commerce@123" },
        { label: "Expected User", value: "Avery Stone" },
      ],
    },
    targetElements: [
      "input[type='email']",
      "input[type='password']",
      "button[type='submit']",
    ],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-AUTH-UI-002",
    title: "Sign-In Validation for Empty and Malformed Email",
    feature: "Authentication",
    scope: "Functional",
    type: "UI",
    priority: "P1",
    automationEligibility: "Automatable",
    description:
      "Verify client-side validation errors trigger on blank or invalid email formats.",
    endpointOrRoute: "Route: / (Sign In)",
    steps: [
      {
        step: 1,
        action: "Leave email blank and click submit.",
        expectedResult: "Inline error 'Email address is required.' displays.",
      },
      {
        step: 2,
        action: "Enter 'invalid-email' without domain and click submit.",
        expectedResult: "Inline error 'Enter a valid email address.' displays.",
      },
    ],
    bddScenario: {
      given: ["User is on the sign-in panel"],
      when: [
        "User inputs an improperly formatted email address",
        "Attempts to submit the form",
      ],
      then: [
        "Form submission is prevented",
        "Validation message is displayed under the input",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Empty email",
        inputs: { email: "", password: "Commerce@123" },
        expected: "Email address is required.",
      },
      {
        scenario: "Missing domain",
        inputs: { email: "admin@", password: "Commerce@123" },
        expected: "Enter a valid email address.",
      },
      {
        scenario: "Missing at symbol",
        inputs: { email: "admincommerce.test", password: "Commerce@123" },
        expected: "Enter a valid email address.",
      },
    ],
    uiTestData: {
      title: "Invalid Email Test Cases",
      items: [
        { label: "Empty Email", value: "''" },
        { label: "Missing Domain", value: "admin@" },
        { label: "Missing @ Sign", value: "admincommerce.test" },
      ],
    },
    targetElements: ["#signin-email-error", "[role='alert']"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-AUTH-UI-003",
    title: "Toggle Password Visibility in Sign-In Form",
    feature: "Authentication",
    scope: "Functional",
    type: "UI",
    priority: "P2",
    automationEligibility: "Ignored / Covered by E2E",
    ignoredReason:
      "Covered in end-to-end journey TC-AUTH-E2E-001; standalone visibility toggle is low risk and omitted from core CI regression.",
    description:
      "Verify password field toggles between masked password bullets and plain text.",
    endpointOrRoute: "Route: / (Sign In)",
    steps: [
      {
        step: 1,
        action: "Type password into the password field.",
        expectedResult: "Characters are masked as bullets (type='password').",
      },
      {
        step: 2,
        action: "Click 'Show' button.",
        expectedResult:
          "Input type switches to 'text'; password becomes visible.",
      },
      {
        step: 3,
        action: "Click 'Hide' button.",
        expectedResult:
          "Input type reverts to 'password'; characters are masked.",
      },
    ],
    bddScenario: {
      given: ["User has entered text into the password input"],
      when: ["User clicks the show/hide password toggle"],
      then: ["Input type switches between 'password' and 'text'"],
    },
    dataDrivenDataset: [
      {
        scenario: "Toggle Show",
        inputs: { initial: "password", action: "click show" },
        expected: "type attribute is text",
      },
      {
        scenario: "Toggle Hide",
        inputs: { initial: "text", action: "click hide" },
        expected: "type attribute is password",
      },
    ],
    uiTestData: {
      title: "Toggle Visibility Data",
      items: [
        { label: "Sample Password", value: "Commerce@123" },
        { label: "Initial Type", value: "password" },
        { label: "Toggled Type", value: "text" },
      ],
    },
    targetElements: ["button:has-text('Show')", "button:has-text('Hide')"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-AUTH-UI-MOCK-001",
    title: "Network Mock: Session Expiry 401 Forces Auto-Redirect to Login",
    feature: "Authentication",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    isNetworkMockOrIntercept: true,
    mockDetails: {
      routePattern: "**/api/auth/session",
      mockStatus: 401,
      behavior:
        "Intercept /api/auth/session with 401 Unauthorized to assert UI redirects to login without uncaught errors.",
    },
    description:
      "Verify that an intercepted 401 response on session validation immediately redirects the user to the login screen.",
    endpointOrRoute: "Route: /api/auth/session (Network Intercept)",
    steps: [
      {
        step: 1,
        action:
          "Configure test runner to intercept /api/auth/session with status 401.",
        expectedResult:
          "Network handler set to return { user: null } with status 401.",
      },
      {
        step: 2,
        action: "Reload authenticated workspace view.",
        expectedResult:
          "Application unmounts workspace and renders LoginPanel with email input.",
      },
    ],
    bddScenario: {
      given: ["User is browsing the authenticated workspace"],
      when: ["Session validation endpoint returns 401 Unauthorized"],
      then: [
        "User is automatically redirected to the login panel",
        "Session cookie is cleared",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Token Expired 401",
        inputs: { status: 401, payload: "unauthorized" },
        expected: "Redirect to login",
      },
      {
        scenario: "Token Revoked 403",
        inputs: { status: 403, payload: "forbidden" },
        expected: "Redirect to login",
      },
    ],
    uiTestData: {
      title: "Session Interception Mock Configuration",
      items: [
        { label: "Route Pattern", value: "**/api/auth/session" },
        { label: "Mocked Status", value: "401 Unauthorized" },
        { label: "Expected View", value: "LoginPanel" },
      ],
    },
    targetElements: ["input[type='email']", "button[type='submit']"],
    automationTool: "Network Interception / Mocking (Cypress, Playwright, MSW)",
  },
  {
    id: "TC-AUTH-API-001",
    title: "POST /api/auth/login - Authenticate with Valid Credentials",
    feature: "Authentication",
    scope: "Functional",
    type: "API",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify login endpoint returns 200 OK, user profile payload, and HttpOnly session cookie.",
    endpointOrRoute: "POST /api/auth/login",
    steps: [
      {
        step: 1,
        action:
          "Send POST request to /api/auth/login with valid email and password.",
        expectedResult:
          "HTTP 200 OK returned with user object and Set-Cookie header.",
      },
    ],
    bddScenario: {
      given: ["Client has valid administrator credentials"],
      when: [
        "Client issues POST /api/auth/login with credentials in request body",
      ],
      then: [
        "Response status is 200 OK",
        "Set-Cookie header sets commerce_session",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Standard Admin Login",
        inputs: { email: "admin@commerce.test", role: "admin" },
        expected: "200 OK with usr-101",
      },
    ],
    apiTestData: {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      requestBody: {
        email: "admin@commerce.test",
        password: "Commerce@123",
      },
    },
    targetElements: ["POST /api/auth/login"],
    automationTool: "Playwright Request / Supertest",
  },
  {
    id: "TC-AUTH-E2E-001",
    title: "E2E Flow: Admin Authentication, Navigation Traversal, and Sign Out",
    feature: "Authentication",
    coveredFeatures: ["Authentication", "Products", "Profile"],
    scope: "E2E",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Complete user journey: sign in, navigate through workspace catalog, inspect profile name in header, and sign out.",
    endpointOrRoute: "Route: / (Auth -> Navigation -> Profile -> Sign Out)",
    steps: [
      {
        step: 1,
        action: "Submit valid admin login credentials.",
        expectedResult: "Dashboard displays with Avery Stone in header.",
      },
      {
        step: 2,
        action: "Navigate to Products catalog and inspect items.",
        expectedResult: "Products table renders with active items.",
      },
      {
        step: 3,
        action: "Open profile menu and click 'Sign Out'.",
        expectedResult: "Session ends and view redirects to login form.",
      },
    ],
    bddScenario: {
      given: ["User starts unauthenticated"],
      when: [
        "User signs in with admin credentials",
        "Navigates to Products",
        "Clicks Sign Out in profile menu",
      ],
      then: ["Session ends cleanly and user returns to login"],
    },
    dataDrivenDataset: [
      {
        scenario: "Admin Lifecycle",
        inputs: { user: "admin@commerce.test", destination: "Products" },
        expected: "Clean authentication and teardown",
      },
    ],
    uiTestData: {
      title: "End-to-End User Credentials",
      items: [
        { label: "Admin Email", value: "admin@commerce.test" },
        { label: "Admin Password", value: "Commerce@123" },
        { label: "Start Route", value: "/" },
        { label: "End Route", value: "/ (Signed Out)" },
      ],
    },
    targetElements: [
      "input[type='email']",
      "header button:has-text('Sign Out')",
    ],
    automationTool: "Playwright / Cypress E2E",
  },

  // =========================================================================
  // 2. PRODUCTS
  // =========================================================================
  {
    id: "TC-PROD-UI-001",
    title: "Create Product with Valid Data and Media Attachment",
    feature: "Products",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify user can complete product fields, upload an image, and create a catalog item.",
    endpointOrRoute: "Route: / (Products view)",
    steps: [
      {
        step: 1,
        action:
          "Fill Name, Code 'PRD-888', Category 'Electronics', Price 149, Stock 25.",
        expectedResult:
          "Form inputs accept all values without validation errors.",
      },
      {
        step: 2,
        action: "Upload product image and click 'Create Product'.",
        expectedResult:
          "Success toast appears; new item renders in catalog table.",
      },
    ],
    bddScenario: {
      given: ["User is on the Products view"],
      when: [
        "User fills out product attributes and uploads a product image",
        "Clicks Create Product",
      ],
      then: [
        "Product is added to catalog",
        "Success toast notification is displayed",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Electronics Item",
        inputs: { code: "PRD-888", price: 149, stock: 25 },
        expected: "Created successfully",
      },
      {
        scenario: "Apparel Item",
        inputs: { code: "PRD-889", price: 49, stock: 50 },
        expected: "Created successfully",
      },
    ],
    uiTestData: {
      title: "New Product Creation Data",
      items: [
        { label: "Product Name", value: "Aero Wireless Headset" },
        { label: "Product Code", value: "PRD-888" },
        { label: "Category", value: "Electronics" },
        { label: "Price", value: "$149" },
        { label: "Stock", value: "25 units" },
        { label: "Status", value: "Active" },
      ],
    },
    targetElements: [
      "input[placeholder*='Canvas Weekender Bag']",
      "button:has-text('Create Product')",
    ],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-PROD-UI-002",
    title: "Enforce Required Fields and Create Button Disabled State",
    feature: "Products",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify 'Create Product' submit button remains disabled until all mandatory fields and image are provided.",
    endpointOrRoute: "Route: / (Products view)",
    steps: [
      {
        step: 1,
        action: "Inspect 'Create Product' button on empty form.",
        expectedResult: "Button is disabled.",
      },
      {
        step: 2,
        action: "Fill all text fields but omit image upload.",
        expectedResult:
          "Button remains disabled; media error message displays.",
      },
    ],
    bddScenario: {
      given: ["User is creating a new product"],
      when: ["Mandatory fields or product image are missing"],
      then: ["Create Product submit button remains disabled"],
    },
    dataDrivenDataset: [
      {
        scenario: "Missing Code",
        inputs: { name: "Chair", code: "", price: 90 },
        expected: "Button disabled",
      },
      {
        scenario: "Missing Image",
        inputs: { name: "Chair", code: "PRD-01", images: 0 },
        expected: "Button disabled",
      },
    ],
    uiTestData: {
      title: "Validation Requirement Set",
      items: [
        {
          label: "Required Fields",
          value: "Name, Code, Category, Price, Stock, Image",
        },
        {
          label: "Expected State",
          value: "Disabled attribute on submit button",
        },
      ],
    },
    targetElements: ["button[type='submit']:disabled", "[role='alert']"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-PROD-UI-003",
    title: "Edit Product and Lock Product Code to Read-Only",
    feature: "Products",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify clicking edit populates the form, locks the product code input, and saves changes.",
    endpointOrRoute: "Route: / (Products view)",
    steps: [
      {
        step: 1,
        action: "Click edit icon button on product row.",
        expectedResult:
          "Form transitions to 'Edit product' mode; product code is read-only.",
      },
      {
        step: 2,
        action: "Update Price to $99 and click Save Product Changes.",
        expectedResult: "Table updates with new price; toast confirms update.",
      },
    ],
    bddScenario: {
      given: ["Catalog contains existing products"],
      when: ["User clicks edit on a product row", "Modifies price and saves"],
      then: [
        "Product code remains unchanged (read-only)",
        "Updated price is reflected in catalog",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Price Modification",
        inputs: { initialPrice: 120, newPrice: 99 },
        expected: "Price saved as $99",
      },
    ],
    uiTestData: {
      title: "Product Edit Data",
      items: [
        { label: "Target Product", value: "Signal Desk Lamp" },
        { label: "Updated Price", value: "$99" },
        {
          label: "Product Code Status",
          value: "Read-Only (disabled for editing)",
        },
      ],
    },
    targetElements: ["[data-testid='row-button-edit']", "input[readonly]"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-PROD-UI-MOCK-001",
    title: "Network Mock: Intercept 500 Server Error & Verify UI Error Banner",
    feature: "Products",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    isNetworkMockOrIntercept: true,
    mockDetails: {
      routePattern: "**/api/products",
      mockStatus: 500,
      behavior:
        "Intercept GET /api/products with HTTP 500 to assert the frontend displays a graceful error alert instead of crashing.",
    },
    description:
      "Verify that backend 500 failures display an accessible error boundary with a retry action.",
    endpointOrRoute: "Route: /api/products (Network Intercept)",
    steps: [
      {
        step: 1,
        action: "Intercept GET /api/products with status 500.",
        expectedResult: "Test runner intercepts catalog request.",
      },
      {
        step: 2,
        action: "Reload products view.",
        expectedResult:
          "Error alert renders with 'Failed to load products' and Retry action.",
      },
    ],
    bddScenario: {
      given: ["User opens the products catalog"],
      when: ["Backend catalog service responds with 500 Internal Server Error"],
      then: [
        "An error alert banner displays gracefully",
        "A retry button is available",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "500 Server Error",
        inputs: { status: 500 },
        expected: "Error alert shown",
      },
      {
        scenario: "503 Service Unavailable",
        inputs: { status: 503 },
        expected: "Error alert shown",
      },
    ],
    uiTestData: {
      title: "500 Error Interception Setup",
      items: [
        { label: "Intercept Route", value: "**/api/products" },
        { label: "Simulated Status", value: "500 Internal Server Error" },
        { label: "Expected Banner", value: "Failed to load products" },
      ],
    },
    targetElements: ["[role='alert']", "button:has-text('Retry')"],
    automationTool: "Network Interception / Mocking (Cypress, Playwright, MSW)",
  },
  {
    id: "TC-PROD-API-001",
    title: "GET /api/products - List All Catalog Products",
    feature: "Products",
    scope: "Functional",
    type: "API",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify endpoint returns list of all products with full schema attributes.",
    endpointOrRoute: "GET /api/products",
    steps: [
      {
        step: 1,
        action: "Send GET request to /api/products.",
        expectedResult: "Status code 200 OK returned with products array.",
      },
    ],
    bddScenario: {
      given: ["Products catalog has active records"],
      when: ["Client issues GET /api/products"],
      then: [
        "Status is 200 OK",
        "Response body contains products array with schema fields",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Full Catalog Request",
        inputs: { endpoint: "/api/products" },
        expected: "200 OK, array of products",
      },
    ],
    apiTestData: {
      headers: {
        Accept: "application/json",
      },
      queryParams: {
        limit: 50,
      },
    },
    targetElements: ["GET /api/products"],
    automationTool: "Playwright Request / Supertest",
  },
  {
    id: "TC-PROD-API-002",
    title: "POST /api/products - Create Product & Enforce Unique Code",
    feature: "Products",
    scope: "Functional",
    type: "API",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify product creation succeeds for unique code and returns 409 Conflict for duplicate code.",
    endpointOrRoute: "POST /api/products",
    steps: [
      {
        step: 1,
        action: "POST product with unique code 'PRD-UNIQUE-101'.",
        expectedResult: "Status 201 Created returned with product object.",
      },
      {
        step: 2,
        action: "POST another product with identical code 'PRD-UNIQUE-101'.",
        expectedResult: "Status 409 Conflict returned with error message.",
      },
    ],
    bddScenario: {
      given: ["Product code PRD-UNIQUE-101 exists in database"],
      when: ["Client attempts to POST another product with PRD-UNIQUE-101"],
      then: [
        "Response status is 409 Conflict",
        "Error indicates code already exists",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Unique Code",
        inputs: { code: "PRD-UNIQ-001" },
        expected: "201 Created",
      },
      {
        scenario: "Duplicate Code",
        inputs: { code: "PRD-UNIQ-001" },
        expected: "409 Conflict",
      },
    ],
    apiTestData: {
      headers: {
        "Content-Type": "application/json",
      },
      requestBody: {
        productCode: "PRD-UNIQUE-101",
        name: "Smart Ambient Mug",
        category: "Kitchen",
        price: 45,
        stock: 10,
        status: "Active",
      },
    },
    targetElements: ["POST /api/products"],
    automationTool: "Playwright Request / Supertest",
  },
  {
    id: "TC-PROD-E2E-001",
    title: "E2E Flow: Admin Ingestion, Low-Stock Check, and Cart Addition",
    feature: "Products",
    coveredFeatures: ["Authentication", "Products", "Inventory", "Cart"],
    scope: "E2E",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Cross-feature flow: log in, create low-stock item in Products, verify low-stock badge in Inventory, and add item to Cart.",
    endpointOrRoute: "Route: / (Auth -> Products -> Inventory -> Cart)",
    steps: [
      {
        step: 1,
        action: "Sign in with admin credentials.",
        expectedResult: "Dashboard renders.",
      },
      {
        step: 2,
        action: "Create product 'Studio Monitor X1' with stock 5.",
        expectedResult: "Product appears in catalog table.",
      },
      {
        step: 3,
        action: "Navigate to Inventory view.",
        expectedResult: "Health column shows 'Low stock' for 5 units.",
      },
      {
        step: 4,
        action: "Navigate to Cart view and add 'Studio Monitor X1'.",
        expectedResult: "Item is added to cart and total updates.",
      },
    ],
    bddScenario: {
      given: ["Admin user is logged in"],
      when: [
        "User creates a low-stock product in catalog",
        "Checks inventory status",
        "Adds product to cart",
      ],
      then: [
        "Inventory displays low-stock warning",
        "Cart recalculates total with added item",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Low-Stock Purchase Flow",
        inputs: { product: "Studio Monitor X1", stock: 5, price: 299 },
        expected: "Flow succeeds through cart addition",
      },
    ],
    uiTestData: {
      title: "E2E Ingestion Data",
      items: [
        { label: "Product Name", value: "Studio Monitor X1" },
        { label: "Product Code", value: "PRD-E2E-001" },
        { label: "Initial Stock", value: "5 units (triggers low stock)" },
        { label: "Unit Price", value: "$299" },
      ],
    },
    targetElements: [
      "button:has-text('Create Product')",
      "nav button:has-text('Cart')",
    ],
    automationTool: "Playwright / Cypress E2E",
  },

  // =========================================================================
  // 3. INVENTORY
  // =========================================================================
  {
    id: "TC-INV-UI-001",
    title: "Verify Stock Health Status and Low-Stock Alert Display",
    feature: "Inventory",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify inventory table displays 'Low stock' when stock <= 10 and 'Healthy' when stock > 10.",
    endpointOrRoute: "Route: / (Inventory view)",
    steps: [
      {
        step: 1,
        action: "Navigate to Inventory page.",
        expectedResult:
          "Inventory table and stock alerts sidebar are displayed.",
      },
      {
        step: 2,
        action: "Locate product with stock 8 (Signal Desk Lamp).",
        expectedResult: "Health column displays 'Low stock' badge.",
      },
    ],
    bddScenario: {
      given: ["User is on the inventory management page"],
      when: ["Products have stock quantities less than or equal to 10"],
      then: [
        "A 'Low stock' status badge is rendered in red/amber",
        "Item is listed in stock alerts card",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Stock <= 10",
        inputs: { stock: 8 },
        expected: "Low stock badge",
      },
      {
        scenario: "Stock > 10",
        inputs: { stock: 25 },
        expected: "Healthy badge",
      },
    ],
    uiTestData: {
      title: "Stock Threshold Test Data",
      items: [
        { label: "Low Stock Cutoff", value: "<= 10 units" },
        { label: "Healthy Cutoff", value: "> 10 units" },
        { label: "Sample Item", value: "Signal Desk Lamp (8 units)" },
      ],
    },
    targetElements: ["table tbody tr", ".rounded-full:has-text('low stock')"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-INV-UI-002",
    title: "Bulk Inventory CSV Upload with Valid Data",
    feature: "Inventory",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify uploading a valid inventory CSV sheet updates existing product stocks or adds new items.",
    endpointOrRoute: "Route: / (Inventory view)",
    steps: [
      {
        step: 1,
        action:
          "Upload valid CSV file containing columns productCode, productName, category, price, stock, status.",
        expectedResult:
          "Upload status displays 'Imported X inventory rows'; table refreshes with new stocks.",
      },
    ],
    bddScenario: {
      given: ["User has a valid CSV inventory sheet"],
      when: ["User uploads the CSV file via inventory dropzone"],
      then: [
        "File is parsed successfully",
        "Inventory table updates with imported records",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Valid 2-row CSV",
        inputs: { rows: 2, validHeaders: true },
        expected: "Imported 2 inventory rows",
      },
    ],
    uiTestData: {
      title: "CSV Upload Test Data",
      items: [
        { label: "File Name", value: "inventory_import.csv" },
        {
          label: "Headers",
          value: "productCode,productName,category,price,stock,status",
        },
        {
          label: "Row 1",
          value: "PRD-CSV-1, Desk Lamp, Office, 85, 20, Active",
        },
      ],
    },
    targetElements: ["input[type='file'][accept*='csv']", "[role='status']"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-INV-UI-003",
    title: "Reject Invalid CSV File and Exceeded Size Limit",
    feature: "Inventory",
    scope: "Functional",
    type: "UI",
    priority: "P1",
    automationEligibility: "Ignored / Covered by E2E",
    ignoredReason:
      "Covered in bulk flow TC-INV-E2E-001; negative boundary checks are verified via unit parser tests.",
    description:
      "Verify file validation rejects non-CSV files, malformed headers, and files exceeding 1MB max limit.",
    endpointOrRoute: "Route: / (Inventory view)",
    steps: [
      {
        step: 1,
        action: "Attempt uploading non-CSV file (.pdf).",
        expectedResult:
          "Error toast: 'Only CSV files are supported for inventory import.'",
      },
    ],
    bddScenario: {
      given: ["User attempts file upload in inventory view"],
      when: ["File is not a CSV or exceeds 1 MB limit"],
      then: [
        "Upload is blocked",
        "Error notification displays specific failure reason",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Wrong Extension",
        inputs: { ext: ".png" },
        expected: "Only CSV files are supported",
      },
      {
        scenario: "Size > 1MB",
        inputs: { sizeMb: 1.5 },
        expected: "Inventory file must be smaller than 1 MB",
      },
    ],
    uiTestData: {
      title: "File Restriction Rules",
      items: [
        { label: "Allowed Format", value: ".csv only" },
        { label: "Maximum Size", value: "1 MB (1,048,576 bytes)" },
      ],
    },
    targetElements: ["input[type='file']", "[role='status']"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-INV-E2E-001",
    title:
      "E2E Flow: Bulk Inventory CSV Upload, Catalog Ingestion, and Cart Purchase",
    feature: "Inventory",
    coveredFeatures: ["Inventory", "Products", "Cart"],
    scope: "E2E",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "End-to-end multi-feature flow: upload bulk inventory CSV, verify new SKU appears in Products catalog search, and add the imported product to Cart.",
    endpointOrRoute: "Route: / (Inventory -> Products -> Cart)",
    steps: [
      {
        step: 1,
        action: "In Inventory view, upload CSV with SKU 'PRD-CSV-901'.",
        expectedResult:
          "Toast confirms import; inventory row shows PRD-CSV-901.",
      },
      {
        step: 2,
        action: "Navigate to Products view and search 'PRD-CSV-901'.",
        expectedResult: "Products table displays imported Mechanical Keyboard.",
      },
      {
        step: 3,
        action: "Navigate to Cart view and add Mechanical Keyboard.",
        expectedResult: "Item is added to cart and Cart Total updates.",
      },
    ],
    bddScenario: {
      given: ["User has an inventory CSV with novel SKU PRD-CSV-901"],
      when: [
        "User uploads the CSV in Inventory",
        "Searches for the SKU in Products",
        "Adds the new SKU to Cart",
      ],
      then: [
        "Product appears in catalog",
        "Cart incorporates new line item into total",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Bulk Ingestion to Purchase",
        inputs: { sku: "PRD-CSV-901", price: 139 },
        expected: "Flow finishes with updated cart total",
      },
    ],
    uiTestData: {
      title: "Bulk Ingestion E2E Record",
      items: [
        { label: "Imported SKU", value: "PRD-CSV-901" },
        { label: "Product Title", value: "Mechanical Keyboard" },
        { label: "Category", value: "Electronics" },
        { label: "Unit Price", value: "$139" },
      ],
    },
    targetElements: [
      "input[type='file'][accept*='csv']",
      "button:has-text('Add Selected Product')",
    ],
    automationTool: "Playwright / Cypress E2E",
  },

  // =========================================================================
  // 4. CART
  // =========================================================================
  {
    id: "TC-CART-UI-001",
    title: "Add Product to Cart via Custom Dropdown and Update Total",
    feature: "Cart",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify selecting a product from custom dropdown and clicking 'Add Selected Product' adds the item and updates cart total.",
    endpointOrRoute: "Route: / (Cart view)",
    steps: [
      {
        step: 1,
        action:
          "Select 'Cloud Brew Mug' from dropdown and click Add Selected Product.",
        expectedResult:
          "Item appears in cart list with quantity 1; Cart Total updates.",
      },
    ],
    bddScenario: {
      given: ["User is on the Cart page"],
      when: [
        "User selects a product from the dropdown and clicks Add Selected Product",
      ],
      then: [
        "Product is added to cart list with quantity 1",
        "Cart total recalculates",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Mug Addition",
        inputs: { product: "Cloud Brew Mug", price: 32 },
        expected: "Total increases by $32",
      },
    ],
    uiTestData: {
      title: "Add to Cart Test Item",
      items: [
        { label: "Selected Product", value: "Cloud Brew Mug" },
        { label: "Unit Price", value: "$32" },
        { label: "Initial Quantity", value: "1" },
      ],
    },
    targetElements: [
      "button:has-text('Choose product')",
      "button:has-text('Add Selected Product')",
    ],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-CART-UI-002",
    title: "Increment and Decrement Cart Item Quantity with Lower Bound",
    feature: "Cart",
    scope: "Functional",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify clicking '+' increments quantity and '-' decrements quantity with a lower bound of 1.",
    endpointOrRoute: "Route: / (Cart view)",
    steps: [
      {
        step: 1,
        action: "Click '+' button on cart row.",
        expectedResult: "Quantity increments by 1; subtotal increases.",
      },
      {
        step: 2,
        action: "Click '-' button repeatedly when quantity is 1.",
        expectedResult:
          "Quantity remains 1; does not decrement to 0 or negative.",
      },
    ],
    bddScenario: {
      given: ["User has an item in cart with quantity 1"],
      when: ["User clicks '+'", "Then clicks '-' multiple times"],
      then: [
        "Quantity increments to 2",
        "Then clamps at minimum 1 without dropping to 0",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Increment from 1",
        inputs: { initial: 1, action: "+" },
        expected: "Quantity is 2",
      },
      {
        scenario: "Decrement at minimum",
        inputs: { initial: 1, action: "-" },
        expected: "Quantity remains 1",
      },
    ],
    uiTestData: {
      title: "Quantity Boundary Rules",
      items: [
        { label: "Minimum Allowed Quantity", value: "1 unit" },
        { label: "Increment Action", value: "Increases by 1 unit" },
        { label: "Decrement Action", value: "Decreases by 1 unit until bound" },
      ],
    },
    targetElements: ["button:has-text('+')", "button:has-text('-')"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-CART-API-001",
    title: "GET /api/cart-items - Retrieve Current Cart Items",
    feature: "Cart",
    scope: "Functional",
    type: "API",
    priority: "P0",
    automationEligibility: "Automatable",
    description: "Verify endpoint returns array of items currently in cart.",
    endpointOrRoute: "GET /api/cart-items",
    steps: [
      {
        step: 1,
        action: "Send GET request to /api/cart-items.",
        expectedResult: "Status 200 OK returned with items array.",
      },
    ],
    bddScenario: {
      given: ["Cart service is running"],
      when: ["Client issues GET /api/cart-items"],
      then: [
        "Status is 200 OK",
        "Body contains items array with id, productId, quantity, and unitPrice",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Get Items",
        inputs: { endpoint: "/api/cart-items" },
        expected: "200 OK with items",
      },
    ],
    apiTestData: {
      headers: {
        Accept: "application/json",
      },
    },
    targetElements: ["GET /api/cart-items"],
    automationTool: "Playwright Request / Supertest",
  },
  {
    id: "TC-CART-API-002",
    title: "POST /api/cart-items - Add Product or Increment Existing",
    feature: "Cart",
    scope: "Functional",
    type: "API",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Verify adding a new productId creates a cart item; adding an existing productId increments quantity.",
    endpointOrRoute: "POST /api/cart-items",
    steps: [
      {
        step: 1,
        action:
          "POST /api/cart-items with { productId: 'prd-102', quantity: 2 }.",
        expectedResult: "Status 201 Created returned with new cart item.",
      },
      {
        step: 2,
        action: "POST /api/cart-items with same productId and quantity 3.",
        expectedResult:
          "Status 201 Created; existing item quantity incremented to 5.",
      },
    ],
    bddScenario: {
      given: ["Cart contains 2 units of prd-102"],
      when: ["Client issues POST /api/cart-items with quantity 3 for prd-102"],
      then: ["Quantity increments to 5", "Status 201 Created is returned"],
    },
    dataDrivenDataset: [
      {
        scenario: "Novel Product",
        inputs: { productId: "prd-102", qty: 2 },
        expected: "201 Created, qty 2",
      },
      {
        scenario: "Existing Product Increment",
        inputs: { productId: "prd-102", qty: 3 },
        expected: "201 Created, qty 5",
      },
    ],
    apiTestData: {
      headers: {
        "Content-Type": "application/json",
      },
      requestBody: {
        productId: "prd-102",
        quantity: 2,
      },
    },
    targetElements: ["POST /api/cart-items"],
    automationTool: "Playwright Request / Supertest",
  },
  {
    id: "TC-CART-E2E-001",
    title:
      "E2E Flow: Catalog Ordering, Quantity Adjustment, and Removal Confirmation",
    feature: "Cart",
    coveredFeatures: ["Products", "Cart", "Inventory"],
    scope: "E2E",
    type: "UI",
    priority: "P0",
    automationEligibility: "Automatable",
    description:
      "Cross-feature flow: add items from catalog, scale quantities, verify live cart recalculation, and remove with confirmation modal.",
    endpointOrRoute: "Route: / (Products -> Cart -> Inventory)",
    steps: [
      {
        step: 1,
        action: "Click 'Add to Cart' on Signal Desk Lamp in Products view.",
        expectedResult: "Item is added to cart.",
      },
      {
        step: 2,
        action: "Open Cart view and increment quantity to 3.",
        expectedResult: "Total updates to $237.",
      },
      {
        step: 3,
        action: "Click 'Remove' and confirm in modal dialog.",
        expectedResult:
          "Item is deleted from cart; empty state renders if last item.",
      },
    ],
    bddScenario: {
      given: ["Products catalog has active items"],
      when: [
        "User adds product, increments quantity, and confirms removal in modal",
      ],
      then: ["Cart reflects real-time totals and updates state upon deletion"],
    },
    dataDrivenDataset: [
      {
        scenario: "Full Ordering Lifecycle",
        inputs: { product: "Signal Desk Lamp", qty: 3 },
        expected: "Added, updated, and removed cleanly",
      },
    ],
    uiTestData: {
      title: "Cart Lifecycle Test Data",
      items: [
        { label: "Product Name", value: "Signal Desk Lamp" },
        { label: "Unit Price", value: "$79" },
        { label: "Target Quantity", value: "3 units" },
        { label: "Expected Subtotal", value: "$237" },
      ],
    },
    targetElements: [
      "nav button:has-text('Cart')",
      "button:has-text('Remove')",
    ],
    automationTool: "Playwright / Cypress E2E",
  },

  // =========================================================================
  // 5. REPORTS & OPERATIONS
  // =========================================================================
  {
    id: "TC-REP-UI-001",
    title: "Verify Metrics Snapshot Cards and Category Filter Drilldown",
    feature: "Reports",
    scope: "Functional",
    type: "UI",
    priority: "P1",
    automationEligibility: "Automatable",
    description:
      "Verify KPI cards accurately reflect active, draft, and total product counts and cart value.",
    endpointOrRoute: "Route: / (Reports view)",
    steps: [
      {
        step: 1,
        action: "Navigate to Reports page.",
        expectedResult: "Snapshot cards display database counts.",
      },
      {
        step: 2,
        action: "Select 'Kitchen' from Category Drilldown.",
        expectedResult: "Preview table filters to Kitchen items.",
      },
    ],
    bddScenario: {
      given: ["User navigates to Reports view"],
      when: ["User inspects KPI metrics and selects category filter"],
      then: [
        "KPI cards match database state",
        "Table filters to selected category",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "Kitchen Filter",
        inputs: { category: "Kitchen" },
        expected: "Shows only Kitchen products",
      },
    ],
    uiTestData: {
      title: "Report Drilldown Parameters",
      items: [
        { label: "Selected Category", value: "Kitchen" },
        {
          label: "Verified Metric Cards",
          value: "Total Products, Active Products, Draft Products, Cart Total",
        },
      ],
    },
    targetElements: ["article:has-text('Total Products')", "select"],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-REP-UI-002",
    title: "Operations Review Controls and Dispatch Scheduling",
    feature: "Reports",
    scope: "Functional",
    type: "UI",
    priority: "P1",
    automationEligibility: "Automatable",
    description:
      "Verify operational checklist, shipping priority radio, dispatch date picker, and multi-channel dropdown maintain state.",
    endpointOrRoute: "Route: / (Reports view)",
    steps: [
      {
        step: 1,
        action: "Check 'Pricing verified' checklist item.",
        expectedResult: "Checkbox toggles to checked state.",
      },
      {
        step: 2,
        action: "Select 'Express' shipping radio button.",
        expectedResult: "Express radio selects and Standard deselects.",
      },
      {
        step: 3,
        action: "Pick dispatch date and toggle stock notifications switch.",
        expectedResult: "Controls retain selected values without page reload.",
      },
    ],
    bddScenario: {
      given: ["User is on the Operations Review section"],
      when: ["User checks audit items and changes shipping priority"],
      then: ["State updates immediately without page refresh"],
    },
    dataDrivenDataset: [
      {
        scenario: "Express Shipping",
        inputs: { priority: "express", verified: true },
        expected: "Express selected",
      },
    ],
    uiTestData: {
      title: "Operations Form Inputs",
      items: [
        { label: "Pricing Verified", value: "true" },
        { label: "Shipping Priority", value: "express" },
        { label: "Selected Channel", value: "Retail Counter" },
        { label: "Dispatch Date", value: "2026-10-01" },
      ],
    },
    targetElements: [
      "input[type='checkbox']",
      "input[type='radio']",
      "input[type='date']",
    ],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-REP-E2E-001",
    title:
      "E2E Flow: Catalog Price Adjustment, Inventory Sync, and Task Migration",
    feature: "Reports",
    coveredFeatures: ["Products", "Inventory", "Reports"],
    scope: "E2E",
    type: "UI",
    priority: "P1",
    automationEligibility: "Automatable",
    description:
      "Verify that updating product pricing in the catalog immediately synchronizes with Inventory, updates Reports KPI cards, and supports moving task board cards to Done.",
    endpointOrRoute: "Route: / (Products -> Inventory -> Reports)",
    steps: [
      {
        step: 1,
        action:
          "Edit 'Canvas Weekender Bag' in Products to price $150 and stock 20.",
        expectedResult: "Product row updates with new price and stock.",
      },
      {
        step: 2,
        action: "Navigate to Inventory view.",
        expectedResult:
          "Stock reflects 20 units and Health badge displays 'Healthy'.",
      },
      {
        step: 3,
        action:
          "Navigate to Reports view and drag 'Verify product price' task to Done.",
        expectedResult:
          "KPI cards update; task moves to Done lane with confirmation toast.",
      },
    ],
    bddScenario: {
      given: ["Administrator adjusts product pricing"],
      when: [
        "Changes are saved and user navigates across Inventory and Reports",
      ],
      then: ["All downstream reports and task boards reflect updated values"],
    },
    dataDrivenDataset: [
      {
        scenario: "Price Sync to Reports",
        inputs: { product: "Canvas Weekender Bag", price: 150 },
        expected: "Reflected in inventory and reports",
      },
    ],
    uiTestData: {
      title: "Catalog Synchronization Data",
      items: [
        { label: "Updated Product", value: "Canvas Weekender Bag" },
        { label: "New Price", value: "$150" },
        { label: "New Stock", value: "20 units (Healthy)" },
        { label: "Target Task", value: "Verify product price -> Done" },
      ],
    },
    targetElements: [
      "[data-testid='row-button-edit']",
      "nav button:has-text('Reports')",
    ],
    automationTool: "Playwright / Cypress E2E",
  },

  // =========================================================================
  // 6. SUPPORT
  // =========================================================================
  {
    id: "TC-SUP-UI-001",
    title: "Submit Support Ticket with Priority Selection",
    feature: "Support",
    scope: "Functional",
    type: "UI",
    priority: "P2",
    automationEligibility: "Automatable",
    description:
      "Verify filling subject, choosing priority from custom dropdown, and submitting displays a success toast.",
    endpointOrRoute: "Route: / (Support view)",
    steps: [
      {
        step: 1,
        action:
          "Fill subject, select Priority 'High' from dropdown, and enter description.",
        expectedResult: "Fields accept input.",
      },
      {
        step: 2,
        action: "Click 'Submit'.",
        expectedResult:
          "Toast notification: 'Support request submitted successfully.'",
      },
    ],
    bddScenario: {
      given: ["User is on the Support center page"],
      when: ["User selects priority 'High' and submits a support ticket"],
      then: [
        "Success confirmation toast is shown",
        "Form remains ready for new submissions",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "High Priority Ticket",
        inputs: { priority: "High", subject: "Sync discrepancy" },
        expected: "Ticket logged as High priority",
      },
      {
        scenario: "Low Priority Ticket",
        inputs: { priority: "Low", subject: "Invoice question" },
        expected: "Ticket logged as Low priority",
      },
    ],
    uiTestData: {
      title: "Support Ticket Data",
      items: [
        { label: "Subject", value: "Inventory sync discrepancy" },
        { label: "Priority", value: "High" },
        {
          label: "Description",
          value: "Physical count differs from recorded warehouse inventory.",
        },
      ],
    },
    targetElements: [
      "input[placeholder='Support subject']",
      "button:has-text('Submit')",
    ],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-SUP-E2E-001",
    title: "E2E Flow: Inventory Discrepancy Escalation and Support Routing",
    feature: "Support",
    coveredFeatures: ["Authentication", "Inventory", "Support"],
    scope: "E2E",
    type: "UI",
    priority: "P1",
    automationEligibility: "Automatable",
    description:
      "Cross-feature journey: admin identifies inventory anomaly, escalates a High-priority support ticket, and verifies operational confirmation.",
    endpointOrRoute: "Route: / (Inventory -> Support -> Notification)",
    steps: [
      {
        step: 1,
        action: "Inspect Inventory table to identify product discrepancy.",
        expectedResult: "Inventory list is visible.",
      },
      {
        step: 2,
        action:
          "Navigate to Support page and submit High-priority ticket with SKU details.",
        expectedResult: "Toast notification confirms ticket registration.",
      },
    ],
    bddScenario: {
      given: ["Admin user observes warehouse discrepancy"],
      when: ["Admin routes issue to Support with High priority"],
      then: ["Ticket is successfully registered and acknowledged"],
    },
    dataDrivenDataset: [
      {
        scenario: "Escalation Flow",
        inputs: { sku: "PRD-888", priority: "High" },
        expected: "Ticket logged successfully",
      },
    ],
    uiTestData: {
      title: "Escalation Ticket Details",
      items: [
        { label: "Discrepancy Source", value: "Inventory Table (PRD-888)" },
        {
          label: "Ticket Subject",
          value: "Urgent: Stock count mismatch PRD-888",
        },
        { label: "Selected Priority", value: "High" },
      ],
    },
    targetElements: [
      "nav button:has-text('Support')",
      "button:has-text('Submit')",
    ],
    automationTool: "Playwright / Cypress E2E",
  },

  // =========================================================================
  // 7. PROFILE
  // =========================================================================
  {
    id: "TC-PROF-UI-001",
    title: "Update Admin Profile Settings and Upload Avatar",
    feature: "Profile",
    scope: "Functional",
    type: "UI",
    priority: "P2",
    automationEligibility: "Automatable",
    description:
      "Verify updating name, country code, phone, and uploading an avatar persists in workspace header.",
    endpointOrRoute: "Route: / (Profile view)",
    steps: [
      {
        step: 1,
        action:
          "Update Full Name to 'Avery Stone Senior', country code to '+44', phone to '020 7946 0912'.",
        expectedResult: "Fields update with new values.",
      },
      {
        step: 2,
        action: "Upload new avatar file and click 'Save Profile'.",
        expectedResult:
          "Toast 'Profile updated.' appears; workspace top header updates name and avatar.",
      },
    ],
    bddScenario: {
      given: ["Administrator is on the Profile page"],
      when: ["User updates profile attributes and clicks Save Profile"],
      then: [
        "Confirmation toast appears",
        "Workspace header synchronizes with new profile data",
      ],
    },
    dataDrivenDataset: [
      {
        scenario: "UK Profile Update",
        inputs: { countryCode: "+44", phone: "020 7946 0912" },
        expected: "Saved with +44 prefix",
      },
      {
        scenario: "US Profile Update",
        inputs: { countryCode: "+1", phone: "415 555 0199" },
        expected: "Saved with +1 prefix",
      },
    ],
    uiTestData: {
      title: "Profile Update Data",
      items: [
        { label: "Full Name", value: "Avery Stone Senior" },
        { label: "Country Code", value: "+44 (United Kingdom)" },
        { label: "Phone Number", value: "020 7946 0912" },
        { label: "Avatar File", value: "profile-avatar.jpg" },
      ],
    },
    targetElements: [
      "input[type='file'][accept='image/*']",
      "button:has-text('Save Profile')",
    ],
    automationTool: "Playwright / Cypress",
  },
  {
    id: "TC-PROF-E2E-001",
    title:
      "E2E Flow: Admin Profile Update, Support Escalation, and Clean Sign-Out",
    feature: "Profile",
    coveredFeatures: ["Profile", "Support", "Authentication"],
    scope: "E2E",
    type: "UI",
    priority: "P2",
    automationEligibility: "Automatable",
    description:
      "Verify administrator updates their store contact and phone details, submits an operational escalation support ticket, and cleanly signs out of the workspace.",
    endpointOrRoute: "Route: / (Profile -> Support -> Sign Out)",
    steps: [
      {
        step: 1,
        action:
          "In Profile view, update phone to '020 7946 0999' and click Save Profile.",
        expectedResult: "Toast confirms update.",
      },
      {
        step: 2,
        action: "Navigate to Support and submit inquiry ticket.",
        expectedResult: "Toast confirms ticket registration.",
      },
      {
        step: 3,
        action: "Click Sign Out in top right header dropdown.",
        expectedResult: "Session is deleted; login form displays.",
      },
    ],
    bddScenario: {
      given: ["Admin user is logged in"],
      when: ["User updates profile, logs a support ticket, and signs out"],
      then: ["All updates persist and session teardown executes without error"],
    },
    dataDrivenDataset: [
      {
        scenario: "Profile Lifecycle Teardown",
        inputs: { phone: "020 7946 0999", action: "Sign Out" },
        expected: "Session cleared successfully",
      },
    ],
    uiTestData: {
      title: "Admin Lifecycle Data",
      items: [
        { label: "Updated Phone", value: "020 7946 0999" },
        { label: "Support Subject", value: "E2E Reconciliation Discrepancy" },
        { label: "Final Action", value: "Sign Out" },
      ],
    },
    targetElements: [
      "button:has-text('Save Profile')",
      "header button:has-text('Sign Out')",
    ],
    automationTool: "Playwright / Cypress E2E",
  },
];
