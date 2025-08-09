# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fintrak is a financial tracking monorepo with three main packages:
- **API** (`apps/api`): TypeScript Express.js server with MongoDB integration and external MI service connectivity
- **Mobile** (`apps/mobile`): React Native Expo application for portfolio management
- **Types** (`packages/types`): Shared TypeScript types across API and mobile apps

## Monorepo Structure

The project follows a typical monorepo pattern:
- `apps/`: Application packages (api, mobile)
- `packages/`: Shared libraries (types)
- Root-level Biome configuration for code quality across all packages

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
pnpm dev                 # Start development server with hot reload (ts-node-dev)
pnpm lint                # Run Biome linting
pnpm lint-fix            # Fix linting issues automatically  
pnpm format              # Check code formatting
pnpm format-fix          # Auto-format code
```

### Mobile (`apps/mobile`)
```bash
pnpm start               # Start Expo development server
pnpm android             # Start with Android emulator/device
pnpm ios                 # Start with iOS simulator/device
pnpm web                 # Start with web browser
```

### Shared Types (`packages/types`)
```bash
pnpm build               # Compile TypeScript to dist/
pnpm dev                 # Watch mode compilation (tsc --watch)
```

## Architecture Patterns

### API Architecture
- **MVC Pattern**: Controllers handle requests, models define data structures, routes organize endpoints
- **Middleware-based**: JWT authentication, CORS, error handling through Express middleware
- **External Integration**: MI service client with automatic token management and retry logic
- **Database**: MongoDB with Mongoose ODM for user data persistence
- **Documentation**: Swagger/OpenAPI 3.0 with interactive UI at `/api/docs`

### Mobile Architecture
- **Expo Framework**: React Native with Expo SDK (~53.0.20)
- **Context-based State**: NavigationContext, PortfolioContext, ThemeContext for app-wide state
- **Component Structure**: Screens, components, and context providers organized by feature
- **Platform Support**: iOS, Android, and Web with adaptive configurations

### Shared Types
- **Centralized Types**: Financial product models (Product, CashAccount, Deposit, IndexedFund, UserProducts)
- **Cross-package Usage**: Both API and mobile import as `@fintrak/types` using pnpm workspace references

## Key Configuration

### Code Quality (Biome)
- **Formatting**: 2-space indentation, single quotes, ES5 trailing commas, 80-character line width
- **Linting**: Recommended rules with `noExplicitAny` disabled for flexibility
- **Scope**: Configured to check `src/**/*` files across packages

### Environment Setup
API requires environment variables:
- Database: `MONGODB_URI`, `JWT_SECRET`
- External Service: `MI_AUTH_UI`, `MI_API`, `MI_USER`, `MI_PASS`
- Server: `PORT` (defaults to 3000)

### Development Notes
- Use pnpm workspace commands from root level for cross-package operations
- Use `pnpm --filter <package>` to run commands in specific packages
- API serves Swagger docs at `/api/docs` for endpoint testing
- Mobile app uses Expo's new architecture (`newArchEnabled: true`)
- Types package must be built before use in dependent packages