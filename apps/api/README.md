# Fintrak API

A TypeScript Express.js API for financial tracking that integrates with external financial institutions to provide users with comprehensive portfolio management.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📊 **Financial Products Integration** - Fetch deposits, cash accounts, and indexed funds from MI service
- 📚 **Interactive API Documentation** - Swagger UI with comprehensive endpoint documentation
- 🛡️ **TypeScript** - Full type safety throughout the application
- 🗄️ **MongoDB Integration** - User data persistence with Mongoose
- 🔧 **Code Quality** - Biome for linting and formatting
- ⚡ **Hot Reload** - Development server with automatic restart

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Documentation**: Swagger/OpenAPI 3.0
- **Code Quality**: Biome (linting & formatting)
- **Development**: ts-node-dev for hot reload

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- Access to MI financial service (credentials required)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fintrak-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/fintrak
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   
   # Server Port
   PORT=3000
   
   # MI Service Integration
   MI_AUTH_UI=https://api.mi-service.com/auth
   MI_API=https://api.mi-service.com/v1
   MI_USER=your-mi-username
   MI_PASS=your-mi-password

   # AWS S3 Configuration (for media uploads)
   AWS_REGION=eu-west-1
   S3_BUCKET_NAME=fintrak-media-prod
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000`

## API Documentation

### Interactive Documentation
Visit `http://localhost:3000/api/docs` for interactive Swagger UI documentation where you can:
- Explore all available endpoints
- Test API calls directly in the browser
- View request/response schemas
- Understand authentication requirements

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Endpoints

#### Get User Products
```http
GET /api/products
Authorization: Bearer <jwt-token>
```

Returns user's financial products including:
- **Deposits**: Fixed-term deposits with interest rates and maturity dates
- **Cash Accounts**: Current account balances and types
- **Indexed Funds**: Investment funds with performance metrics

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Auto-format code
npm run format:fix
```

### Code Quality

This project uses [Biome](https://biomejs.dev/) for:
- **Linting**: Code quality and consistency checks
- **Formatting**: Automatic code formatting with single quotes and consistent style
- **TypeScript**: Full type checking and IntelliSense support

### Project Structure

```
src/
├── config/          # Configuration files
│   ├── db.ts       # MongoDB connection
│   └── swagger.ts  # Swagger/OpenAPI configuration
├── controllers/     # Request handlers
│   ├── AuthController.ts
│   └── ProductController.ts
├── middleware/      # Express middleware
│   └── auth.ts     # JWT authentication middleware
├── models/         # Database models
│   ├── UserModel.ts
│   └── ProductModel.ts
├── routes/         # API route definitions
│   ├── authRoutes.ts
│   └── productRoutes.ts
├── services/       # External service integrations
│   ├── MI.ts       # MI service client
│   └── MICast.ts   # Data transformation utilities
├── types/          # TypeScript type definitions
│   ├── User.ts
│   └── Product.ts
└── index.ts        # Application entry point
```

## External Integration

### MI Service
The application integrates with an external financial institution (MI) service to fetch real-time user financial data. The integration includes:

- **Automatic Token Management**: Handles authentication and token refresh
- **Error Handling**: Graceful handling of service unavailability
- **Data Transformation**: Converts MI service responses to standardized formats
- **Retry Logic**: Automatic retry on authentication failures

## Media Upload (S3 Integration)

The API supports file uploads to AWS S3 for media storage such as counterparty logos, profile pictures, receipts, and documents.

### Features

- 📤 **Secure Uploads**: JWT-authenticated endpoint for file uploads
- 🗂️ **Organized Storage**: Files organized by user and media type
- ✅ **Validation**: File type (images/PDFs) and size (10MB max) validation
- 🌐 **Public URLs**: Returns public S3 URLs for uploaded files
- 🔒 **IAM Security**: Uses AWS IAM credentials for secure bucket access

### Setup

1. **Create an S3 Bucket**
   ```bash
   # Create bucket in AWS Console or via CLI
   aws s3 mb s3://fintrak-media-prod --region eu-west-1
   ```

2. **Configure Bucket Permissions**
   - Enable public read access for uploaded files
   - Configure CORS for web uploads (if needed)

   Example bucket policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::fintrak-media-prod/*"
       }
     ]
   }
   ```

3. **Create IAM User with S3 Permissions**

   Required IAM policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::fintrak-media-prod/*"
       }
     ]
   }
   ```

4. **Configure Environment Variables**

   Add AWS credentials to your `.env` file (see Environment Setup above)

### File Organization

Files are automatically organized in S3 with the following structure:
```
s3://fintrak-media-prod/
└── users/
    └── {userId}/
        ├── counterparty-logo/
        │   └── filename.jpg
        ├── profile-picture/
        │   └── avatar.png
        ├── receipt/
        │   └── receipt-123.pdf
        ├── document/
        │   └── statement.pdf
        └── other/
            └── file.jpg
```

### Usage Example

```bash
# Upload a counterparty logo
curl -X POST http://localhost:3000/api/upload/media \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "file=@logo.jpg" \
  -F "type=counterparty-logo"

# Response
{
  "url": "https://fintrak-media-prod.s3.eu-west-1.amazonaws.com/users/123/counterparty-logo/logo.jpg",
  "type": "counterparty-logo",
  "userId": "123"
}
```

### Supported Media Types

- `counterparty-logo` - Company/vendor logos
- `profile-picture` - User profile avatars
- `receipt` - Transaction receipts
- `document` - Financial documents
- `other` - Miscellaneous files

### File Restrictions

- **Allowed types**: Images (JPEG, PNG, GIF, WebP) and PDFs
- **Maximum size**: 10MB per file
- **Authentication**: JWT token required

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |
| `PORT` | Server port | No | 3000 |
| `MI_AUTH_UI` | MI service authentication endpoint | Yes | - |
| `MI_API` | MI service API base URL | Yes | - |
| `MI_USER` | MI service username | Yes | - |
| `MI_PASS` | MI service password | Yes | - |
| `AWS_REGION` | AWS region for S3 bucket | No | eu-west-1 |
| `S3_BUCKET_NAME` | S3 bucket name for media storage | No | fintrak-media-prod |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key ID | Yes* | - |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret access key | Yes* | - |

*Required only if using media upload features

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and ensure tests pass
4. Run linting and formatting: `npm run lint:fix && npm run format:fix`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

This project is licensed under the ISC License.