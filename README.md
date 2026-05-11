# ShopCore

A full-stack e-commerce platform built as a portfolio project. Covers authentication, product catalog, shopping cart, checkout, order history, and a complete seller dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Zustand |
| Backend | ASP.NET Core (.NET 10), Clean Architecture, EF Core 10 |
| Database | SQLite |
| Auth | JWT (stateless) |
| Forms | react-hook-form + Zod |
| HTTP | Axios with JWT interceptor |

## Features

- **Auth** — JWT login with session persistence via Zustand + localStorage
- **Catalog** — Product grid with category filter and real-time search
- **Cart** — Quantity controls, subtotals, persistent across navigation
- **Checkout** — Order summary with simulated payment flow
- **Orders** — Order history with status indicators and expandable item details
- **Seller Dashboard** — Create/edit store, manage products with stock tracking

## Project Structure

```
shop-core/
├── src/                        # ASP.NET Core backend
│   ├── ShopCore.Api/           # Controllers, middleware, program entry
│   ├── ShopCore.Application/   # Use cases, interfaces, DTOs
│   ├── ShopCore.Domain/        # Entities, value objects (no dependencies)
│   └── ShopCore.Infrastructure/# EF Core, repositories, migrations
└── next-front/                 # Next.js frontend
    └── src/
        ├── app/                # App Router pages
        ├── components/         # Shared UI components
        ├── services/           # API call functions (Axios)
        ├── store/              # Zustand stores (auth, cart)
        ├── models/             # TypeScript interfaces
        └── lib/                # Axios instance, utilities
```

## Running Locally

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)

### Backend

```bash
cd shop-core/src/ShopCore.Api
dotnet run
# API available at http://localhost:5000
```

### Frontend

```bash
cd shop-core/next-front
npm install
npm run dev
# App available at http://localhost:3000
```

The Next.js dev server proxies `/api/*` requests to `http://localhost:5000` via `next.config.ts` rewrites — no CORS configuration needed.

## Architecture Decisions

**Clean Architecture on the backend** — The `Domain` layer has zero external dependencies. `Application` orchestrates use cases through interfaces. `Infrastructure` owns EF Core and repository implementations. This isolation makes the database layer swappable without touching business logic.

**SQLite for development** — Removes all infrastructure friction for local setup. Switching to PostgreSQL or SQL Server requires only a provider change in `Infrastructure` — EF Core abstracts the rest.

**Next.js over Angular** — The project started with Angular 21 and was migrated. For a public portfolio, Next.js offers better SEO (SSR/SSG), smaller bundle, and trivial deployment on Vercel. The trade-off is losing Angular's opinionated DI system, which scales better in large enterprise teams.

**Zustand over Redux** — Redux introduces significant boilerplate at this project scale. Zustand's `persist` middleware handles localStorage sync for both auth tokens and cart state with minimal code.

**Client-side AuthGuard** — Route protection lives in a `'use client'` component that checks Zustand auth state on mount. This avoids cookie + JWT complexity in the Next.js edge runtime. The backend already protects all sensitive endpoints via `[Authorize]`.

## CI

GitHub Actions runs on every push and pull request to `main`:
- `backend` job: `dotnet restore` → `dotnet build`
- `frontend` job: `npm ci` → `npm run lint` → `npm run build`

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
