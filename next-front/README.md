# ShopCore — Frontend

Next.js 16 frontend for the ShopCore e-commerce platform. For full project documentation, architecture decisions, and how to run the backend, see the [root README](../README.md).

## Tech Stack

- **Next.js 16** (App Router) — SSR, file-based routing, server components
- **TypeScript** — end-to-end type safety with shared model interfaces
- **Tailwind CSS 4** — utility-first styling with `@theme` design tokens
- **Zustand** — auth and cart state with `persist` middleware (localStorage)
- **react-hook-form + Zod** — typed form validation
- **Axios** — HTTP client with JWT interceptor

## Running Locally

```bash
npm install
npm run dev
# http://localhost:3000
```

Requires the backend running at `http://localhost:5000`. The dev server proxies all `/api/*` requests automatically.

## Project Structure

```
src/
├── app/              # App Router pages
│   ├── catalog/      # Product listing with search + filter
│   ├── cart/         # Shopping cart
│   ├── checkout/     # Order placement
│   ├── orders/       # Order history
│   ├── login/        # Authentication
│   └── seller/       # Seller dashboard (store + products)
├── components/       # AuthGuard, Header, SellerHeader
├── services/         # Axios-based API functions
├── store/            # Zustand stores (auth, cart)
├── models/           # TypeScript interfaces
└── lib/              # Axios instance, formatters
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
