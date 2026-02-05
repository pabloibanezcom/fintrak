# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fintrak is a financial tracking monorepo with four main packages:
- **API** (`apps/api`): TypeScript Express.js server with MongoDB integration and external MI service connectivity
- **Web** (`apps/web`): Next.js 14 dashboard application with App Router, i18n, and CSS Modules
- **Mobile** (`apps/mobile`): React Native Expo application for portfolio management
- **Types** (`packages/types`): Shared TypeScript types across all apps

## Quick File Locations

| What | Where |
|------|-------|
| API Controllers | `apps/api/src/controllers/` |
| API Routes | `apps/api/src/routes/` |
| API Models | `apps/api/src/models/` |
| API Services | `apps/api/src/services/` |
| Web Pages | `apps/web/src/app/` |
| Web Components | `apps/web/src/components/` |
| Web Services | `apps/web/src/services/` |
| Web Contexts | `apps/web/src/context/` |
| Shared Types | `packages/types/src/` |

## Development Commands

### Root Level (Monorepo)
```bash
pnpm dev-api             # Start API development server
pnpm dev-mobile          # Start mobile app with Expo
pnpm build               # Build all packages
pnpm lint                # Run linting across all packages
pnpm lint-fix            # Fix linting issues across all packages
pnpm format              # Check formatting across all packages
pnpm format-fix          # Auto-format code across all packages
```

### API (`apps/api`)
```bash
pnpm dev                 # Start development server with hot reload
pnpm test                # Run tests
pnpm test:watch          # Run tests in watch mode
pnpm lint-fix            # Fix linting issues
pnpm format-fix          # Auto-format code
```

### Web (`apps/web`)
```bash
pnpm dev                 # Start Next.js dev server
pnpm build               # Production build
pnpm lint                # Run linting
```

### Mobile (`apps/mobile`)
```bash
pnpm start               # Start Expo development server
pnpm ios                 # Start with iOS simulator
pnpm android             # Start with Android emulator
```

### Shared Types (`packages/types`)
```bash
pnpm build               # Compile TypeScript to dist/
pnpm dev                 # Watch mode compilation
```

## Import Conventions

```typescript
// Web app - use @ alias
import { formatCurrency } from '@/utils';
import { StatCard } from '@/components/dashboard';
import { useUser } from '@/context';

// Shared types - all apps
import type { Product, CryptoAsset } from '@fintrak/types';
```

## Architecture Patterns

### API Architecture
- **MVC Pattern**: Controllers handle requests, models define data structures, routes organize endpoints
- **Middleware-based**: JWT authentication, CORS, error handling through Express middleware
- **External Integration**: MI service client with automatic token management and retry logic
- **Database**: MongoDB with Mongoose ODM
- **Documentation**: Swagger/OpenAPI 3.0 at `/api/docs`

### Web Architecture
- **Next.js App Router**: Pages in `app/`, layouts for shared UI
- **Route Groups**: `(auth)` for login/register, `(dashboard)` for authenticated pages
- **CSS Modules**: Component-scoped styles with `.module.css` files
- **Contexts**: UserContext, ThemeContext, SessionContext, SyncContext for state
- **i18n**: next-intl for internationalization

### Web Component Structure
```
components/ui/ComponentName/
├── ComponentName.tsx       # Component implementation
├── ComponentName.module.css # Scoped styles
└── index.ts                # Barrel export
```

### Mobile Architecture
- **Expo Framework**: React Native with Expo SDK
- **Context-based State**: NavigationContext, PortfolioContext, ThemeContext
- **Platform Support**: iOS, Android, and Web

## Adding Features

### New API Endpoint
1. Create controller in `apps/api/src/controllers/`
2. Create route in `apps/api/src/routes/`
3. Register route in `apps/api/src/index.ts`
4. Add Swagger documentation

### New Web Component
1. Create folder: `components/ui/ComponentName/`
2. Add `ComponentName.tsx` with typed props interface
3. Add `ComponentName.module.css` for styles
4. Add `index.ts` barrel export: `export { ComponentName } from './ComponentName';`

### New Shared Type
1. Add type to `packages/types/src/`
2. Export from `packages/types/src/index.ts`
3. Run `pnpm --filter @fintrak/types build`

## Code Quality (Biome)
- **Formatting**: 2-space indentation, single quotes, ES5 trailing commas, 80-character line width
- **Linting**: Recommended rules with `noExplicitAny` disabled
- **Always run**: `pnpm lint-fix && pnpm format-fix` before committing

## Environment Setup

API requires environment variables:
- Database: `MONGODB_URI`, `JWT_SECRET`
- External Service: `MI_AUTH_UI`, `MI_API`, `MI_USER`, `MI_PASS`
- Server: `PORT` (defaults to 3000)
