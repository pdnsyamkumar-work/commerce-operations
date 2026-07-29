# Commerce Operations App Documentation

## Overview

Commerce Operations is a realistic admin workspace for practicing commerce product, inventory, cart, report, support, and authentication workflows.

The app simulates a commerce operations team that manages:

- Product catalog records
- Product images and media
- Inventory health
- CSV inventory imports
- Cart activity
- Reports and review workflows
- Authentication and support flows

## Local Setup

### Required Software

Install these before running the app:

- Node.js 20 or later
- npm 10 or later
- Git
- A modern browser such as Chrome, Edge, or Firefox

### Clone And Run

```bash
git clone https://github.com/pdnsyamkumar/caw-qa-automation-learning.git
cd caw-qa-automation-learning/commerce-operations-app
npm install
npm run dev
```

Open the app:

```text
http://localhost:3000
```

### Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Demo Accounts

```text
Admin email: admin@commerce.test
Admin password: Commerce@123

Operator email: operator@commerce.test
Operator password: Operator@123
```

## Core Features

### Authentication

- Sign in with demo users.
- Request access with the sign-up form.
- Request forgot-password instructions.
- Validate required fields, email format, and password rules.
- Show inline email errors on Sign in, Sign up, and Forgot password instead of native browser tooltips.
- Validate password and confirm-password mismatch.
- Show or hide passwords in Sign in and Sign up forms.

### Layout And Navigation

- Side navigation with icons.
- User profile dropdown.
- Sign out inside the profile dropdown.
- Dashboard, Products, Inventory, Cart, Reports, and Support pages.
- Product Details page from product actions.

### Products

- Capture a unique product code when creating a product.
- Create products.
- Edit products.
- Delete products with confirmation.
- Toggle product status between Active and Draft.
- Search products.
- Sort products.
- Download product data as CSV.
- Attach product images while creating or editing products.
- Preview attached images.
- Remove attached images.
- Require product name, category, price, stock, status, and at least one image before save.
- Require product code to be unique and lock it after creation.
- Enforce maximum field lengths in the create/edit form:
  - Product code: 20 characters
  - Product name: 80 characters
  - Category: 40 characters
  - Price: 7 characters
  - Stock: 5 characters
- Require at least one image before product creation.
- Disable Create Product until all validations pass.
- View products in Table, Grid, List, Kanban, Gallery, Detail, and Bulk views.
- Jump between pagination pages using page numbers.
- Select multiple products from a custom multi-select dropdown.
- Run bulk actions:
  - Toggle selected
  - Add selected to cart
  - Delete selected

### Inventory

- View inventory in a table.
- Review stock health.
- See low-stock alerts.
- Upload inventory CSV files.
- Validate CSV format.
- Validate max file size.
- Download a sample inventory upload template.

### Cart

- Choose a product from a custom dropdown.
- Add selected products to cart.
- Increase and decrease quantity.
- Remove cart items with confirmation.
- Validate cart total updates.

### Reports

- Review catalog and cart metrics.
- Use checkboxes, radio buttons, custom multi-select dropdown, date input, switch, slider, iframe, and drag-and-drop controls.
- Filter product drilldowns by category.
- Submit review approval through a dialog.

### Support

- Submit support request practice data.
- Use a custom priority dropdown.
- Review help topics.

### Notifications

- Show toast messages in the top-right corner.
- Auto-hide toast messages after a few seconds.
- Close toast messages manually.

## User Stories

### Product Management

- As a catalog manager, I want each product to have a unique product code so that records can be identified consistently.
- As a catalog manager, I want to create products with valid data so that the catalog stays clean.
- As a catalog manager, I want to attach product images so that products have visual context.
- As a catalog manager, I want to preview and remove attached images before saving.
- As a catalog manager, I want to edit products so that pricing, stock, status, and images stay current.
- As a catalog manager, I want to delete products with confirmation so that destructive actions are explicit.
- As a catalog manager, I want to switch products between Active and Draft so that publishing readiness is controlled.
- As a catalog manager, I want multiple product views so that I can review the same catalog data in different layouts.

### Inventory

- As an inventory operator, I want to view stock health so that I can act on low-stock items.
- As an inventory operator, I want to upload a CSV stock sheet so that bulk update flows can be tested.
- As an inventory operator, I want a sample CSV template so that I know the expected upload format.

### Cart

- As an operator, I want to add products to a cart so that order preparation flows can be tested.
- As an operator, I want to change quantities so that totals and item counts update.
- As an operator, I want confirmation before removing cart items.

### Reports And Support

- As an operations reviewer, I want to review metrics so that I can understand catalog and cart health.
- As an operations reviewer, I want to preview order details in an iframe so that embedded content can be validated.
- As a support user, I want to submit request details so that support form behavior can be practiced.

## UI Practice Coverage

This app includes common UI patterns:

- Auth flows
- Required fields
- Inline errors
- Password visibility toggles
- Disabled submit buttons
- Tables
- Pagination with page numbers
- Row actions
- Icon buttons
- Native select dropdowns
- Custom button-based dropdowns
- Custom multi-select dropdowns
- File upload
- Image preview
- File download
- Toasts
- Dialogs
- Iframes
- Drag-and-drop
- Navigation
- Search and sorting
- Bulk selection and bulk actions
- CRUD APIs
- Length-limited text inputs
- Browser-safe validation messages

## Data Reset Behavior

The app uses an in-memory demo store.

- Created products appear while the app server is running.
- Edited products appear while the app server is running.
- Deleted products stay deleted while the app server is running.
- Uploaded CSV products appear while the app server is running.
- Attached product images are stored in memory for the current run.
- When the app server is killed or restarted, all pages return to the default seed data.
- This reset behavior is intentional so every practice session starts clean.
