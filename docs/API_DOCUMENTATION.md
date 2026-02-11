# Bazarkhojo – API Documentation
## Complete REST API Reference (Enterprise-Grade)

**Technology Stack:** NestJS + Prisma ORM + PostgreSQL  
**API Type:** RESTful API  
**Authentication:** JWT (Role-based)  
**Base URL:** `https://api.bazarkhojo.com/api/v1`  
**Version:** v1.0  
**Last Updated:** ফেব্রুয়ারি ২০২৬

---

## 📋 Table of Contents
1. [Authentication](#1-authentication-module)
2. [User](#2-user-module)
3. [Seller](#3-seller-module)
4. [Product](#4-product-module)
5. [Category & Brand](#5-category--brand-module)
6. [Cart & Order](#6-cart--order-module)
7. [Payment](#7-payment-module)
8. [Review & Rating](#8-review--rating-module)
9. [Admin](#9-admin-module)
10. [Notification](#10-notification-module)
11. [Delivery/Rider](#11-delivery-rider-module)
12. [Coupon & Deal](#12-coupon--deal-module)
13. [Support & Ticket](#13-support--ticket-module)
14. [Chat](#14-chat-module)
15. [Analytics](#15-analytics--report-module)

---

## Common Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "statusCode": 400
}
```

---

## Authentication Headers

Most endpoints require authentication. Include JWT token in headers:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Module

### 1.1 User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+8801712345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isVerified": false
    }
  }
}
```

---

### 1.2 Seller Registration
**POST** `/auth/seller-register`

**Request Body (multipart/form-data):**
```
email: seller@example.com
password: SecurePass123!
firstName: Seller
lastName: Name
phone: +8801712345678
shopName: My Shop
shopSlug: my-shop
shopDescription: Shop description
tradeLicense: [file]
nid: [file]
shopLogo: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "Seller application submitted. Awaiting admin approval.",
  "data": {
    "user": { ... },
    "seller": {
      "id": "uuid",
      "shopName": "My Shop",
      "shopSlug": "my-shop",
      "isApproved": false
    }
  }
}
```

---

### 1.3 Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

---

### 1.4 Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

---

### 1.5 Logout
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer <token>`

---

### 1.6 Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

### 1.7 Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

---

### 1.8 Setup 2FA
**POST** `/auth/2fa-setup`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "secret": "2FA_SECRET"
  }
}
```

---

### 1.9 Verify 2FA
**POST** `/auth/2fa-verify`

**Request Body:**
```json
{
  "code": "123456"
}
```

---

## 2. User Module

### 2.1 Get Profile
**GET** `/users/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+8801712345678",
    "role": "USER",
    "isActive": true,
    "isVerified": true,
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

---

### 2.2 Update Profile
**PUT** `/users/me`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+8801712345678"
}
```

---

### 2.3 Get Order History
**GET** `/users/orders`

**Query Parameters:**
- `status` (optional): PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-20260101-001",
      "totalAmount": 1500.00,
      "orderStatus": "DELIVERED",
      "createdAt": "2026-01-01T00:00:00Z",
      "items": [...]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 2.4 Get Order Details
**GET** `/users/orders/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-20260101-001",
    "totalAmount": 1500.00,
    "discountAmount": 100.00,
    "taxAmount": 50.00,
    "shippingAmount": 60.00,
    "orderStatus": "DELIVERED",
    "paymentStatus": "PAID",
    "paymentMethod": "BKASH",
    "shippingAddress": {...},
    "trackingNumber": "TRK123456",
    "sellerOrders": [
      {
        "seller": {...},
        "items": [...]
      }
    ],
    "statusHistory": [
      {
        "fromStatus": "PENDING",
        "toStatus": "PROCESSING",
        "changedAt": "2026-01-01T10:00:00Z"
      }
    ]
  }
}
```

---

### 2.5 Track Order
**GET** `/users/orders/:id/track`

**Response:**
```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD-20260101-001",
    "currentStatus": "SHIPPED",
    "trackingNumber": "TRK123456",
    "estimatedDelivery": "2026-01-05T18:00:00Z",
    "timeline": [
      {
        "status": "PENDING",
        "timestamp": "2026-01-01T08:00:00Z",
        "description": "Order placed"
      },
      {
        "status": "PROCESSING",
        "timestamp": "2026-01-01T10:00:00Z",
        "description": "Order confirmed by seller"
      },
      {
        "status": "SHIPPED",
        "timestamp": "2026-01-02T14:00:00Z",
        "description": "Order shipped"
      }
    ],
    "rider": {
      "name": "Rider Name",
      "phone": "+8801712345678"
    }
  }
}
```

---

### 2.6 Wishlist Management

#### Add to Wishlist
**POST** `/users/wishlist`

**Request Body:**
```json
{
  "productId": "uuid"
}
```

#### Get Wishlist
**GET** `/users/wishlist`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "price": 500.00,
        "discountPrice": 450.00,
        "images": [...],
        "seller": {...}
      },
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### Remove from Wishlist
**DELETE** `/users/wishlist/:productId`

---

### 2.7 Address Management

#### Add Address
**POST** `/users/address`

**Request Body:**
```json
{
  "addressLine1": "House 123, Road 456",
  "addressLine2": "Apartment 7B",
  "city": "Dhaka",
  "state": "Dhaka Division",
  "postalCode": "1212",
  "country": "BD",
  "isDefault": true
}
```

#### Get Addresses
**GET** `/users/address`

#### Update Address
**PUT** `/users/address/:id`

#### Delete Address
**DELETE** `/users/address/:id`

---

### 2.8 Follow Seller

#### Follow Seller
**POST** `/users/follow-seller`

**Request Body:**
```json
{
  "sellerId": "uuid"
}
```

#### Get Followed Sellers
**GET** `/users/followed-sellers`

#### Unfollow Seller
**DELETE** `/users/follow-seller/:sellerId`

---

### 2.9 Reviews

#### Add/Edit Review
**POST** `/users/reviews`

**Request Body (multipart/form-data):**
```
productId: uuid
orderItemId: uuid (optional, for verified purchase)
rating: 5
comment: Great product!
images: [file1, file2]
```

#### Delete Review
**DELETE** `/users/reviews/:id`

---

### 2.10 Security Settings

#### Change Password
**PUT** `/users/security/password`

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

#### Enable/Disable 2FA
**PUT** `/users/security/2fa`

**Request Body:**
```json
{
  "enabled": true
}
```

---

### 2.11 Recommendations
**GET** `/users/recommendations`

**Query Parameters:**
- `limit` (optional): Number of products (default: 10)

---

### 2.12 Wallet (Future-Ready)
**GET** `/users/wallet`

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 1000.00,
    "rewardPoints": 500,
    "transactions": [...]
  }
}
```

---

### 2.13 Referral (Future-Ready)
**POST** `/users/referral`

**Response:**
```json
{
  "success": true,
  "data": {
    "referralCode": "USER123",
    "referralLink": "https://bazarkhojo.com/ref/USER123",
    "totalReferrals": 10,
    "earnings": 500.00
  }
}
```

---

## 3. Seller Module

### 3.1 Apply as Seller
**POST** `/sellers/apply`

(Same as `/auth/seller-register`)

---

### 3.2 Get Seller Profile
**GET** `/sellers/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "shopName": "My Shop",
    "shopSlug": "my-shop",
    "shopDescription": "...",
    "shopLogo": "url",
    "shopBanner": "url",
    "subscriptionType": "PREMIUM",
    "subscriptionStart": "2026-01-01T00:00:00Z",
    "subscriptionEnd": "2027-01-01T00:00:00Z",
    "commissionRate": 5.00,
    "isApproved": true,
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

---

### 3.3 Update Shop Info
**PUT** `/sellers/me`

**Request Body (multipart/form-data):**
```
shopName: Updated Shop Name
shopDescription: Updated description
shopLogo: [file]
shopBanner: [file]
bankAccount: {"accountNumber": "123", "bankName": "ABC Bank"}
```

---

### 3.4 Seller Orders

#### Get Orders List
**GET** `/sellers/orders`

**Query Parameters:**
- `status` (optional): PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `page`, `limit`, `startDate`, `endDate`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderId": "uuid",
      "orderNumber": "ORD-20260101-001",
      "subtotal": 1000.00,
      "status": "PROCESSING",
      "items": [
        {
          "product": {...},
          "quantity": 2,
          "price": 500.00
        }
      ],
      "customer": {
        "name": "John Doe",
        "phone": "+8801712345678"
      },
      "shippingAddress": {...},
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "meta": {...}
}
```

#### Accept Order
**PUT** `/sellers/orders/:id/accept`

#### Reject Order
**PUT** `/sellers/orders/:id/reject`

**Request Body:**
```json
{
  "reason": "Out of stock"
}
```

#### Cancel Order
**PUT** `/sellers/orders/:id/cancel`

**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```

#### Update Shipping Status
**PUT** `/sellers/orders/:id/ship`

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRK123456",
  "courierName": "Pathao"
}
```

---

### 3.5 Payouts & Earnings

#### Get Payouts
**GET** `/sellers/payouts`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 50000.00,
    "commissionDeducted": 2500.00,
    "netEarnings": 47500.00,
    "pendingEarnings": 5000.00,
    "availableBalance": 42500.00,
    "payouts": [
      {
        "id": "uuid",
        "amount": 10000.00,
        "status": "PAID",
        "payoutMethod": "BANK",
        "transactionId": "TXN123",
        "createdAt": "2026-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Request Withdrawal
**POST** `/sellers/payouts/withdraw`

**Request Body:**
```json
{
  "amount": 5000.00,
  "payoutMethod": "BANK",
  "bankAccount": {
    "accountNumber": "123456789",
    "accountName": "Seller Name",
    "bankName": "ABC Bank",
    "branchName": "Dhaka"
  }
}
```

---

### 3.6 Analytics
**GET** `/sellers/analytics`

**Query Parameters:**
- `period` (optional): today, week, month, year

**Response:**
```json
{
  "success": true,
  "data": {
    "sales": {
      "today": 5000.00,
      "week": 35000.00,
      "month": 150000.00,
      "total": 500000.00
    },
    "orders": {
      "today": 10,
      "week": 70,
      "month": 300,
      "total": 1000
    },
    "topProducts": [
      {
        "product": {...},
        "totalSales": 50000.00,
        "totalOrders": 100
      }
    ],
    "visitors": {
      "today": 500,
      "week": 3500,
      "month": 15000
    },
    "salesTrend": [
      {
        "date": "2026-01-01",
        "sales": 5000.00,
        "orders": 10
      }
    ]
  }
}
```

---

### 3.7 Inventory

#### Get Inventory
**GET** `/sellers/inventory`

**Query Parameters:**
- `lowStock` (optional): true/false
- `outOfStock` (optional): true/false

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": {...},
      "stock": 5,
      "lowStockThreshold": 10,
      "isLowStock": true,
      "variants": [
        {
          "id": "uuid",
          "attributes": {"size": "M", "color": "Red"},
          "stock": 2
        }
      ]
    }
  ]
}
```

#### Update Stock
**PUT** `/sellers/inventory/:productId`

**Request Body:**
```json
{
  "stock": 100,
  "variants": [
    {
      "id": "uuid",
      "stock": 50
    }
  ]
}
```

---

### 3.8 Discounts

#### Create Discount
**POST** `/sellers/discounts`

**Request Body:**
```json
{
  "productId": "uuid",
  "type": "PERCENTAGE",
  "value": 20,
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-31T23:59:59Z",
  "minPurchaseAmount": 500.00
}
```

#### Get Discounts
**GET** `/sellers/discounts`

#### Update Discount
**PUT** `/sellers/discounts/:id`

#### Delete Discount
**DELETE** `/sellers/discounts/:id`

---

### 3.9 Flash Sale

#### Apply for Flash Sale
**POST** `/sellers/flash-sale/apply`

**Request Body:**
```json
{
  "flashSaleId": "uuid",
  "productId": "uuid",
  "discountPrice": 400.00
}
```

---

### 3.10 Reviews

#### Get Reviews
**GET** `/sellers/reviews`

**Query Parameters:**
- `productId` (optional)
- `rating` (optional): 1-5

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": {...},
      "user": {
        "name": "John Doe"
      },
      "rating": 5,
      "comment": "Great product!",
      "images": [...],
      "reply": null,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### Reply to Review
**POST** `/sellers/reviews/:id/reply`

**Request Body:**
```json
{
  "reply": "Thank you for your feedback!"
}
```

---

### 3.11 Returns

#### Get Return Requests
**GET** `/sellers/returns`

#### Respond to Return
**POST** `/sellers/returns/:id`

**Request Body:**
```json
{
  "action": "APPROVE",
  "comment": "Return approved"
}
```

---

### 3.12 Chat

#### Get Chat Messages
**GET** `/sellers/chat`

**Query Parameters:**
- `userId` (optional): Filter by specific user

#### Send Message
**POST** `/sellers/chat`

**Request Body:**
```json
{
  "userId": "uuid",
  "message": "Hello, how can I help you?"
}
```

---

### 3.13 Subscription

#### Get Subscription
**GET** `/sellers/subscription`

#### Upgrade Subscription
**PUT** `/sellers/subscription/upgrade`

**Request Body:**
```json
{
  "plan": "PREMIUM"
}
```

---

## 4. Product Module

### 4.1 Create Product
**POST** `/products`

**Headers:** `Authorization: Bearer <seller_token>`

**Request Body (multipart/form-data):**
```
name: Product Name
categoryId: uuid
brandId: uuid (optional)
description: Product description
price: 500.00
discountPrice: 450.00 (optional)
stock: 100
lowStockThreshold: 10
images: [file1, file2, file3]
variants: [{"attributes": {"size": "M", "color": "Red"}, "sku": "SKU001", "price": 500, "stock": 50}]
seoTitle: SEO Title
seoDescription: SEO Description
seoKeywords: keyword1, keyword2
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully. Awaiting admin approval.",
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "slug": "product-name",
    "isApproved": false,
    ...
  }
}
```

---

### 4.2 Get Products (Public)
**GET** `/products`

**Query Parameters:**
- `page`, `limit`
- `category` (optional): Category ID
- `brand` (optional): Brand ID
- `seller` (optional): Seller ID
- `minPrice`, `maxPrice` (optional)
- `rating` (optional): Minimum rating
- `search` (optional): Search query
- `sort` (optional): price_asc, price_desc, newest, popular, rating

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "price": 500.00,
      "discountPrice": 450.00,
      "images": ["url1", "url2"],
      "rating": 4.5,
      "reviewCount": 100,
      "seller": {
        "id": "uuid",
        "shopName": "My Shop",
        "shopSlug": "my-shop"
      },
      "category": {...},
      "brand": {...}
    }
  ],
  "meta": {...}
}
```

---

### 4.3 Get Product Details
**GET** `/products/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "slug": "product-name",
    "description": "...",
    "price": 500.00,
    "discountPrice": 450.00,
    "stock": 100,
    "images": [...],
    "variants": [
      {
        "id": "uuid",
        "sku": "SKU001",
        "attributes": {"size": "M", "color": "Red"},
        "price": 500.00,
        "stock": 50
      }
    ],
    "seller": {...},
    "category": {...},
    "brand": {...},
    "reviews": [...],
    "rating": 4.5,
    "reviewCount": 100,
    "seoTitle": "...",
    "seoDescription": "...",
    "relatedProducts": [...]
  }
}
```

---

### 4.4 Update Product
**PUT** `/products/:id`

**Headers:** `Authorization: Bearer <seller_token>`

(Same request format as Create Product)

---

### 4.5 Delete Product
**DELETE** `/products/:id`

**Headers:** `Authorization: Bearer <seller_token>`

---

### 4.6 Bulk Upload
**POST** `/products/bulk-upload`

**Headers:** `Authorization: Bearer <seller_token>`

**Request Body (multipart/form-data):**
```
file: [CSV/Excel file]
```

**CSV Format:**
```
name,categoryId,brandId,description,price,stock,sku
Product 1,uuid,uuid,Description,500,100,SKU001
Product 2,uuid,uuid,Description,600,150,SKU002
```

---

### 4.7 Bulk Export
**POST** `/products/bulk-export`

**Headers:** `Authorization: Bearer <seller_token>`

**Query Parameters:**
- Same as Get Products

**Response:** CSV/Excel file download

---

### 4.8 Approve Product (Admin)
**PUT** `/products/:id/approve`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "approved": true,
  "reason": "Approved" // or rejection reason
}
```

---

### 4.9 Advanced Search
**POST** `/products/search`

**Request Body:**
```json
{
  "query": "laptop",
  "filters": {
    "categories": ["uuid1", "uuid2"],
    "brands": ["uuid1"],
    "priceRange": {
      "min": 10000,
      "max": 50000
    },
    "rating": 4,
    "inStock": true
  },
  "sort": "price_asc",
  "page": 1,
  "limit": 20
}
```

---

## 5. Category & Brand Module

### 5.1 Categories

#### Create Category (Admin)
**POST** `/categories`

**Request Body:**
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "...",
  "parentId": "uuid" // optional, for sub-category
}
```

#### Get Categories
**GET** `/categories`

**Query Parameters:**
- `includeSubcategories` (optional): true/false

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "...",
      "productCount": 500,
      "children": [
        {
          "id": "uuid",
          "name": "Laptops",
          "slug": "laptops",
          "productCount": 100
        }
      ]
    }
  ]
}
```

#### Update Category
**PUT** `/categories/:id`

#### Delete Category
**DELETE** `/categories/:id`

---

### 5.2 Brands

#### Create Brand (Admin/Seller)
**POST** `/brands`

**Request Body (multipart/form-data):**
```
name: Brand Name
slug: brand-name
description: Brand description
logo: [file]
```

#### Get Brands
**GET** `/brands`

#### Update Brand
**PUT** `/brands/:id`

#### Delete Brand
**DELETE** `/brands/:id`

#### Approve Brand (Admin)
**PUT** `/brands/:id/approve`

---

## 6. Cart & Order Module

### 6.1 Cart

#### Add to Cart
**POST** `/cart`

**Request Body:**
```json
{
  "productVariantId": "uuid",
  "quantity": 2
}
```

#### Get Cart
**GET** `/cart`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "productVariant": {
          "id": "uuid",
          "product": {...},
          "attributes": {"size": "M"},
          "price": 500.00
        },
        "quantity": 2,
        "subtotal": 1000.00,
        "seller": {...}
      }
    ],
    "summary": {
      "subtotal": 1000.00,
      "discount": 50.00,
      "shipping": 60.00,
      "tax": 30.00,
      "total": 1040.00
    },
    "sellerBreakdown": [
      {
        "seller": {...},
        "items": [...],
        "subtotal": 1000.00
      }
    ]
  }
}
```

#### Update Cart Item
**PUT** `/cart/:itemId`

**Request Body:**
```json
{
  "quantity": 3
}
```

#### Remove from Cart
**DELETE** `/cart/:itemId`

---

### 6.2 Orders

#### Place Order
**POST** `/orders`

**Request Body:**
```json
{
  "shippingAddressId": "uuid",
  "paymentMethod": "BKASH",
  "couponCode": "SAVE10",
  "notes": "Please deliver in the evening"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-20260101-001",
      "totalAmount": 1040.00,
      "paymentMethod": "BKASH",
      "orderStatus": "PENDING"
    },
    "payment": {
      "gateway": "BKASH",
      "paymentUrl": "https://payment.bkash.com/...",
      "transactionId": "TXN123"
    }
  }
}
```

#### Get Order Details
**GET** `/orders/:id`

(Same as User Order Details)

#### Update Order Status
**PUT** `/orders/:id/status`

**Headers:** `Authorization: Bearer <seller/rider/admin_token>`

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRK123",
  "notes": "Shipped via Pathao"
}
```

#### Get All Orders (Role-based)
**GET** `/orders`

**Query Parameters:**
- `status`, `page`, `limit`, `startDate`, `endDate`
- `sellerId` (admin only)
- `userId` (admin only)

---

### 6.3 Returns

#### Request Return
**POST** `/orders/:id/return`

**Request Body (multipart/form-data):**
```
orderItemId: uuid
reason: Product damaged
description: Detailed description
images: [file1, file2]
```

#### Approve/Reject Refund (Admin/Seller)
**PUT** `/orders/:id/refund`

**Request Body:**
```json
{
  "action": "APPROVE",
  "refundAmount": 500.00,
  "refundMethod": "WALLET",
  "comment": "Refund approved"
}
```

---

### 6.4 Low Stock Products
**GET** `/orders/low-stock`

**Headers:** `Authorization: Bearer <admin/seller_token>`

---

## 7. Payment Module

### 7.1 Initialize Payment
**POST** `/payments/init`

**Request Body:**
```json
{
  "orderId": "uuid",
  "gateway": "BKASH",
  "amount": 1040.00,
  "returnUrl": "https://bazarkhojo.com/payment/success",
  "cancelUrl": "https://bazarkhojo.com/payment/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN123",
    "paymentUrl": "https://payment.bkash.com/...",
    "gateway": "BKASH"
  }
}
```

---

### 7.2 Verify Payment
**POST** `/payments/verify`

**Request Body:**
```json
{
  "transactionId": "TXN123",
  "gateway": "BKASH",
  "paymentId": "BKASH_PAYMENT_ID"
}
```

---

### 7.3 Payment History
**GET** `/payments/history`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`, `limit`, `startDate`, `endDate`

---

### 7.4 Refund
**POST** `/payments/refund`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "paymentId": "uuid",
  "amount": 500.00,
  "reason": "Product return"
}
```

---

### 7.5 Configure Payment Gateways (Admin)
**PUT** `/payments/config`

**Request Body:**
```json
{
  "bkash": {
    "enabled": true,
    "merchantNumber": "...",
    "appKey": "...",
    "appSecret": "..."
  },
  "nagad": {
    "enabled": true,
    "merchantId": "...",
    "publicKey": "...",
    "privateKey": "..."
  },
  "sslcommerz": {
    "enabled": true,
    "storeId": "...",
    "storePassword": "..."
  },
  "cod": {
    "enabled": true
  }
}
```

---

### 7.6 Seller Payout (Admin)
**POST** `/payments/payout`

**Request Body:**
```json
{
  "sellerId": "uuid",
  "amount": 10000.00,
  "payoutMethod": "BANK",
  "transactionId": "BANK_TXN_123"
}
```

---

### 7.7 Pending Payouts (Admin)
**GET** `/payments/pending-payouts`

---

## 8. Review & Rating Module

### 8.1 Add Review
**POST** `/reviews`

**Headers:** `Authorization: Bearer <user_token>`

**Request Body (multipart/form-data):**
```
productId: uuid
orderItemId: uuid (optional)
rating: 5
comment: Great product!
images: [file1, file2]
```

---

### 8.2 Get Product Reviews
**GET** `/reviews/product/:id`

**Query Parameters:**
- `page`, `limit`
- `rating` (optional): Filter by rating

---

### 8.3 Edit Review
**PUT** `/reviews/:id`

**Headers:** `Authorization: Bearer <user_token>`

---

### 8.4 Delete Review
**DELETE** `/reviews/:id`

**Headers:** `Authorization: Bearer <user/admin_token>`

---

### 8.5 Approve/Hide Review (Admin)
**PUT** `/reviews/:id/approve`

**Request Body:**
```json
{
  "approved": true,
  "reason": "Fake review detected"
}
```

---

## 9. Admin Module

### 9.1 Dashboard
**GET** `/admin/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "sales": {
      "today": 50000.00,
      "week": 350000.00,
      "month": 1500000.00,
      "total": 5000000.00
    },
    "orders": {
      "pending": 50,
      "processing": 100,
      "shipped": 200,
      "delivered": 1000,
      "cancelled": 50,
      "total": 1400
    },
    "sellers": {
      "active": 500,
      "pending": 20,
      "suspended": 5,
      "total": 525
    },
    "users": {
      "new": {
        "today": 50,
        "week": 350,
        "month": 1500
      },
      "total": 10000
    },
    "revenue": {
      "gross": 5000000.00,
      "commission": 250000.00,
      "net": 4750000.00
    },
    "recentOrders": [...],
    "pendingRefunds": [...],
    "lowStockProducts": [...],
    "pendingPayouts": [...]
  }
}
```

---

### 9.2 User Management

#### Get Users
**GET** `/admin/users`

**Query Parameters:**
- `role` (optional): USER, SELLER, ADMIN, RIDER
- `status` (optional): ACTIVE, INACTIVE
- `search` (optional)
- `page`, `limit`

#### Block/Unblock User
**PUT** `/admin/users/:id/block`

**Request Body:**
```json
{
  "blocked": true,
  "reason": "Suspicious activity"
}
```

#### Get User Order History
**GET** `/admin/users/:id/orders`

---

### 9.3 Seller Management

#### Get Sellers
**GET** `/admin/sellers`

**Query Parameters:**
- `status` (optional): APPROVED, PENDING, SUSPENDED
- `subscription` (optional): FREE, PREMIUM

#### Approve/Reject Seller
**PUT** `/admin/sellers/:id/approve`

**Request Body:**
```json
{
  "approved": true,
  "reason": "All documents verified"
}
```

#### View Seller Documents
**GET** `/admin/sellers/:id/documents`

---

### 9.4 Product Management

#### Get All Products
**GET** `/admin/products`

#### Edit Product
**PUT** `/admin/products/:id/edit`

---

### 9.5 Order Management

#### Get All Orders
**GET** `/admin/orders`

#### Approve Refund
**PUT** `/admin/orders/:id/refund`

---

### 9.6 Reports

#### Sales Report
**GET** `/admin/reports/sales`

**Query Parameters:**
- `period`: today, week, month, year, custom
- `startDate`, `endDate` (for custom)
- `groupBy`: day, week, month

#### Top Sellers
**GET** `/admin/reports/top-sellers`

**Query Parameters:**
- `period`, `limit`

#### Top Products
**GET** `/admin/reports/top-products`

#### User Behavior
**GET** `/admin/reports/user-behavior`

---

### 9.7 Flash Sales

#### Create Flash Sale
**POST** `/admin/flash-sales`

**Request Body:**
```json
{
  "title": "Weekend Flash Sale",
  "startTime": "2026-01-10T00:00:00Z",
  "endTime": "2026-01-12T23:59:59Z"
}
```

#### Get Flash Sales
**GET** `/admin/flash-sales`

#### Update Flash Sale
**PUT** `/admin/flash-sales/:id`

---

### 9.8 Coupons

#### Create Coupon
**POST** `/admin/coupons`

**Request Body:**
```json
{
  "code": "SAVE20",
  "type": "PERCENTAGE",
  "value": 20,
  "minOrderAmount": 500.00,
  "maxDiscount": 200.00,
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-31T23:59:59Z",
  "usageLimit": 100,
  "sellerId": "uuid", // optional
  "categoryId": "uuid" // optional
}
```

#### Get Coupons
**GET** `/admin/coupons`

#### Update Coupon
**PUT** `/admin/coupons/:id`

---

### 9.9 CMS

#### Create/Update Page
**POST** `/admin/cms/pages`

**Request Body:**
```json
{
  "slug": "about-us",
  "title": "About Us",
  "content": "...",
  "isActive": true
}
```

#### Get Pages
**GET** `/admin/cms/pages`

#### Create Blog
**POST** `/admin/cms/blog`

#### Upload Banner
**POST** `/admin/cms/banner`

---

### 9.10 Security

#### Get Logs
**GET** `/admin/security/logs`

#### Block IP
**PUT** `/admin/security/ip-block`

---

### 9.11 Support

#### Get Tickets
**GET** `/admin/support/tickets`

#### Reply to Ticket
**POST** `/admin/support/tickets/:id/reply`

---

### 9.12 Settings

#### Update Settings
**PUT** `/admin/settings`

**Request Body:**
```json
{
  "siteName": "Bazarkhojo",
  "logo": "url",
  "currency": "BDT",
  "language": "bn",
  "vat": 5,
  "shippingZones": [...],
  "seo": {...},
  "notifications": {...}
}
```

---

### 9.13 Quick Lists

#### Pending Refunds
**GET** `/admin/pending-refunds`

#### Recent Orders
**GET** `/admin/recent-orders`

---

## 10. Notification Module

### 10.1 Get Notifications
**GET** `/notifications`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "ORDER_UPDATE",
      "title": "Order Shipped",
      "isRead": false,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "unreadCount": 5
  }
}
```

---

### 10.2 Mark as Read
**PUT** `/notifications/:id/read`

---

### 10.3 Mark All as Read
**PUT** `/notifications/mark-all-read`

---

### 10.4 Update Preferences
**POST** `/notifications/preferences`

**Request Body:**
```json
{
  "orderUpdates": true,
  "promotions": false,
  "messages": true,
  "payouts": true
}
```

---

## 11. Delivery / Rider Module

### 11.1 Get Assigned Orders
**GET** `/delivery/orders`

**Headers:** `Authorization: Bearer <rider_token>`

**Query Parameters:**
- `status`: ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED

---

### 11.2 Confirm Pickup
**PUT** `/delivery/orders/:id/pickup`

**Request Body (multipart/form-data):**
```
pickupPhoto: [file]
notes: Picked up successfully
```

---

### 11.3 Update Status
**PUT** `/delivery/orders/:id/status`

**Request Body:**
```json
{
  "status": "DELIVERED",
  "notes": "Delivered successfully"
}
```

---

### 11.4 Get Delivery History
**GET** `/delivery/history`

**Response:**
```json
{
  "success": true,
  "data": {
    "deliveries": [...],
    "earnings": {
      "today": 500.00,
      "week": 3500.00,
      "month": 15000.00,
      "total": 50000.00
    }
  }
}
```

---

### 11.5 Upload Proof of Delivery
**POST** `/delivery/proof`

**Request Body (multipart/form-data):**
```
orderId: uuid
photo: [file]
signature: [file]
notes: Delivered to customer
```

---

### 11.6 Track COD Collection
**POST** `/delivery/cash-collect`

**Request Body:**
```json
{
  "orderId": "uuid",
  "amount": 1040.00,
  "collected": true
}
```

---

### 11.7 Chat

#### Get Chat
**GET** `/delivery/chat`

#### Send Message
**POST** `/delivery/chat`

---

### 11.8 Update Location (Future)
**POST** `/delivery/location`

**Request Body:**
```json
{
  "latitude": 23.8103,
  "longitude": 90.4125
}
```

---

## 12. Coupon & Deal Module

### 12.1 Apply Coupon
**POST** `/coupons/apply`

**Request Body:**
```json
{
  "code": "SAVE20",
  "cartId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "discount": 100.00,
    "newTotal": 940.00
  }
}
```

---

### 12.2 Get Flash Sales
**GET** `/deals/flash-sales`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Weekend Flash Sale",
      "startTime": "2026-01-10T00:00:00Z",
      "endTime": "2026-01-12T23:59:59Z",
      "products": [
        {
          "product": {...},
          "discountPrice": 400.00,
          "originalPrice": 500.00,
          "discount": 20
        }
      ]
    }
  ]
}
```

---

### 12.3 Get Deals
**GET** `/deals`

---

## 13. Support & Ticket Module

### 13.1 Create Ticket
**POST** `/support/tickets`

**Request Body:**
```json
{
  "subject": "Order not received",
  "description": "I haven't received my order yet...",
  "priority": "HIGH"
}
```

---

### 13.2 Get Tickets
**GET** `/support/tickets`

---

### 13.3 Reply to Ticket
**POST** `/support/tickets/:id/reply`

**Request Body:**
```json
{
  "message": "We are looking into your issue..."
}
```

---

### 13.4 Close Ticket
**PUT** `/support/tickets/:id/close`

---

## 14. Chat Module

### 14.1 Get Conversations
**GET** `/chat/conversations`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user1": {...},
      "user2": {...},
      "lastMessage": {
        "message": "Hello",
        "createdAt": "2026-01-01T00:00:00Z"
      },
      "unreadCount": 2
    }
  ]
}
```

---

### 14.2 Get Messages
**GET** `/chat/messages/:conversationId`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "senderId": "uuid",
      "message": "Hello, how can I help?",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### 14.3 Send Message
**POST** `/chat/messages`

**Request Body:**
```json
{
  "conversationId": "uuid",
  "message": "I need help with my order"
}
```

---

## 15. Analytics & Report Module

### 15.1 Sales Analytics
**GET** `/analytics/sales`

**Headers:** `Authorization: Bearer <admin/seller_token>`

**Query Parameters:**
- `period`, `startDate`, `endDate`, `groupBy`

---

### 15.2 User Behavior
**GET** `/analytics/user-behavior`

---

### 15.3 Top Items
**GET** `/analytics/top-items`

**Query Parameters:**
- `type`: sellers, products, categories
- `period`, `limit`

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Public APIs**: 100 requests per minute
- **Authenticated APIs**: 300 requests per minute
- **Admin APIs**: 1000 requests per minute

---

## Webhooks (Future)

Webhooks will be available for:
- Order Status Updates
- Payment Confirmations
- Payout Completions
- Product Approvals

---

**End of API Documentation**
