# Setup And Installation

Use this guide to set up the commerce operations app on a local machine.

## Required Software

Install these tools first:

- Git
- Node.js 20 or later
- npm 10 or later
- Chrome, Edge, Firefox, or another modern browser

## Clone The Repository

```bash
git clone https://github.com/pdnsyamkumar/caw-qa-automation-learning.git
cd caw-qa-automation-learning
```

## Install App Dependencies

```bash
cd commerce-operations-app
npm install
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build Check

```bash
npm run build
npm run start
```

## Lint Check

```bash
npm run lint
```

## Demo Accounts

```text
Admin email: admin@commerce.test
Admin password: Commerce@123

Operator email: operator@commerce.test
Operator password: Operator@123
```

## Data Reset Behavior

The app uses an in-memory demo store.

- Product, cart, and upload changes remain only while the server is running.
- Restarting the dev server restores the default seed data.
