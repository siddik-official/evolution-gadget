# Evulation Gadget - Full-Stack E-Commerce Platform

A modern, scalable e-commerce platform specialized in gadget sales and evaluations, built with React TypeScript frontend and Node.js Express TypeScript backend.

## 🚀 Features

### User Roles & Authentication
- **Customer Role**: Browse gadgets, manage cart, place orders, write reviews
- **Admin Role**: Manage products (CRUD), view orders, moderate users, generate reports
- JWT-based authentication with role-based access control
- Secure password hashing with bcrypt

### Core Functionality
- **Product Management**: Full CRUD operations for gadgets with categories, specifications
- **Shopping Cart**: Persistent cart with quantity management
- **Order Processing**: Complete order lifecycle with status tracking
- **Review System**: Customer reviews with ratings, pros/cons
- **Search & Filtering**: Advanced search with category and price filters
- **Responsive Design**: Mobile-first responsive UI

### Technical Features
- **Type Safety**: Full TypeScript implementation on both frontend and backend
- **State Management**: Redux Toolkit for global state management
- **Security**: Helmet, CORS, rate limiting, input validation
- **Performance**: Compression, caching, pagination
- **Error Handling**: Comprehensive error handling and logging

## 📁 Project Structure

```
evulation-gadget/
├── backend/                    # Node.js Express TypeScript API
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth, error handling, security
│   │   ├── models/           # MongoDB Mongoose models
│   │   ├── routes/           # API route definitions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Database connection, helpers
│   │   └── server.ts         # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React TypeScript SPA
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── admin/        # Admin dashboard components
│   │   │   ├── customer/     # Customer-facing components
│   │   │   └── common/       # Shared components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── store/            # Redux store and slices
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Styled Components** for styling
- **Axios** for HTTP requests
- **React Hook Form** for form handling
- **Lucide React** for icons

### Backend
- **Node.js** with Express framework
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Morgan** for logging

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd evulation-gadget
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your settings:
MONGODB_URI=mongodb://localhost:27017/evulation-gadget
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### Gadget Endpoints

#### GET /api/gadgets
Get all gadgets with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `search` (string): Search term
- `category` (string): Filter by category
- `brand` (string): Filter by brand
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `minRating` (number): Minimum rating filter
- `inStock` (boolean): Filter by stock availability
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order - asc/desc (default: desc)

**Response:**
```json
{
  "success": true,
  "message": "Gadgets retrieved successfully",
  "data": [
    {
      "_id": "gadget-id",
      "name": "iPhone 15 Pro",
      "description": "Latest iPhone with advanced features",
      "price": 999.99,
      "originalPrice": 1099.99,
      "category": "smartphone",
      "brand": "Apple",
      "model": "15 Pro",
      "images": ["image-url-1", "image-url-2"],
      "specifications": [
        {"key": "Display", "value": "6.1-inch Super Retina XDR"},
        {"key": "Chip", "value": "A17 Pro"}
      ],
      "stock": 50,
      "isActive": true,
      "averageRating": 4.8,
      "totalReviews": 156,
      "tags": ["smartphone", "apple", "5g"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

#### GET /api/gadgets/:id
Get single gadget by ID.

#### GET /api/gadgets/featured
Get featured gadgets (highly rated products).

#### GET /api/gadgets/category/:category
Get gadgets by category.

#### GET /api/gadgets/search
Search gadgets by query.

### Admin Endpoints (Requires Admin Role)

#### GET /api/gadgets/admin/all
Get all gadgets including inactive ones.

#### POST /api/gadgets/admin
Create a new gadget.

**Request Body:**
```json
{
  "name": "New Gadget",
  "description": "Description of the gadget",
  "price": 299.99,
  "category": "smartphone",
  "brand": "Brand Name",
  "model": "Model Name",
  "images": ["image-url-1", "image-url-2"],
  "specifications": [
    {"key": "Display", "value": "6.0-inch OLED"},
    {"key": "RAM", "value": "8GB"}
  ],
  "stock": 100,
  "tags": ["tag1", "tag2"]
}
```

#### PUT /api/gadgets/admin/:id
Update an existing gadget.

#### DELETE /api/gadgets/admin/:id
Soft delete a gadget (sets isActive to false).

#### DELETE /api/gadgets/admin/:id/permanent
Permanently delete a gadget from database.

### User Management (Admin Only)

#### GET /api/auth/users
Get all users with pagination and filtering.

#### PATCH /api/auth/users/:userId/status
Update user status (activate/deactivate).

#### DELETE /api/auth/users/:userId
Delete a user account.

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with secure signing
- Role-based access control (RBAC)
- Password hashing with bcrypt (cost factor: 12)
- Token expiration and refresh handling

### API Security
- **Helmet**: Security headers (CSP, HSTS, etc.)
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation
- **Request Size Limits**: Protection against large payload attacks

### Data Protection
- **Password Handling**: Never expose passwords in responses
- **Sensitive Data**: Selective field exclusion in queries
- **Error Handling**: No sensitive information in error messages

## 🎨 Frontend Architecture

### State Management
The application uses Redux Toolkit for centralized state management with the following slices:

- **authSlice**: User authentication and profile management
- **cartSlice**: Shopping cart state and operations
- **gadgetSlice**: Product catalog and search results
- **orderSlice**: Order history and status tracking

### Component Structure
- **Pages**: Top-level route components
- **Common**: Reusable UI components (Header, Footer, etc.)
- **Admin**: Admin dashboard components
- **Customer**: Customer-facing components

### API Integration
- Centralized API service with Axios
- Request/response interceptors for authentication
- Error handling and token refresh logic
- Type-safe API calls with TypeScript

## 🗄 Database Schema

### User Model
```typescript
interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // Hashed
  role: 'admin' | 'customer';
  isActive: boolean;
  avatar?: string;
  phone?: string;
  address?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}
```

### Gadget Model
```typescript
interface IGadget {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: GadgetCategory;
  brand: string;
  model: string;
  images: string[];
  specifications: ISpecification[];
  stock: number;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Model
```typescript
interface IOrder {
  _id: string;
  userId: string;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: IAddress;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   PORT=5000
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Static Hosting**
   - Deploy the `build` folder to services like Netlify, Vercel, or AWS S3
   - Configure proxy settings to point to your backend API

### Docker Deployment (Optional)

Create `Dockerfile` for containerized deployment:

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Performance Optimization

### Backend
- **Compression**: Gzip compression for responses
- **Caching**: MongoDB query optimization and indexing
- **Connection Pooling**: MongoDB connection pooling
- **Rate Limiting**: API rate limiting to prevent abuse

### Frontend
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo and useMemo for performance
- **Bundle Optimization**: Webpack optimization for production builds

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in environment variables
   - Verify network connectivity

2. **JWT Token Issues**
   - Check JWT_SECRET in environment variables
   - Verify token expiration settings
   - Clear browser localStorage if needed

3. **CORS Errors**
   - Configure CORS settings in backend
   - Check FRONTEND_URL environment variable
   - Verify request headers

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript configuration
   - Verify all imports and exports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Real-time notifications with WebSocket
- Advanced analytics dashboard
- Multi-language support (i18n)
- Mobile app with React Native
- Advanced search with Elasticsearch
- Email notifications for orders
- Inventory management system
- Wishlist functionality
- Social authentication (Google, Facebook)

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@evulation-gadget.com
- Documentation: [Wiki](../../wiki)

---

Built with ❤️ by the Evulation Gadget Team
