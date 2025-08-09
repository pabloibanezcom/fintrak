# Fintrak

A comprehensive financial tracking monorepo built with TypeScript, featuring a robust API backend and a cross-platform mobile application.

## 🏗️ Architecture

This monorepo contains three main packages:

- **API** (`apps/api`): TypeScript Express.js server with MongoDB integration and external MI service connectivity
- **Mobile** (`apps/mobile`): React Native Expo application for portfolio management  
- **Types** (`packages/types`): Shared TypeScript types across API and mobile apps

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- MongoDB
- Expo CLI (for mobile development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fintrak

# Install dependencies
pnpm install

# Build shared packages
pnpm build
```

### Environment Setup

Create `.env` files in `apps/api`:

```env
MONGODB_URI=mongodb://localhost:27017/fintrak
JWT_SECRET=your-secret-key
MI_AUTH_UI=your-mi-auth-url
MI_API=your-mi-api-url  
MI_USER=your-mi-username
MI_PASS=your-mi-password
PORT=3000
```

## 🛠️ Development

### Start Services

```bash
# Start API development server
pnpm dev-api

# Start mobile app with Expo
pnpm dev-mobile

# Build all packages
pnpm build
```

### Code Quality

```bash
# Run linting across all packages
pnpm lint

# Fix linting issues
pnpm lint-fix

# Check formatting
pnpm format

# Auto-format code
pnpm format-fix
```

## 📱 Applications

### API Server
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth middleware
- **Documentation**: Swagger/OpenAPI 3.0 at `/api/docs`
- **External Integration**: MI service client with retry logic

### Mobile App
- **Framework**: React Native with Expo SDK
- **Platforms**: iOS, Android, Web
- **State Management**: React Context (Navigation, Portfolio, Theme)
- **Architecture**: Feature-based component organization

## 🧩 Package Structure

```
fintrak/
├── apps/
│   ├── api/           # Express.js API server
│   └── mobile/        # React Native Expo app
├── packages/
│   └── types/         # Shared TypeScript definitions
└── biome.json         # Code quality configuration
```

## 🔧 Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces
- **Code Quality**: Biome (linting & formatting)
- **Backend**: Express.js, MongoDB, JWT
- **Mobile**: React Native, Expo
- **Documentation**: Swagger/OpenAPI

## 📚 API Documentation

Once the API server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI Spec**: http://localhost:3000/api/docs.json

## 🤝 Contributing

1. Follow the established code style (Biome configuration)
2. Use the monorepo scripts for consistency
3. Ensure all packages build successfully
4. Run linting and formatting before commits

## 📄 License

ISC License - see package.json for details

---

**Author**: Pablo Ibanez