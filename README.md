# 🛒 E-commerce Backend API

This repository contains the **backend API** for an e-commerce platform.  
It is built with **Node.js, Express, and JWT authentication**, and provides endpoints for managing users, products, categories, carts, orders, payments, and reviews.

The project is structured for scalability and clean code separation, following MVC architecture.

---

## 🚀 Features

- User authentication (JWT)
- Product & category management
- Cart & wishlist functionality
- Orders & checkout
- Payments integration (Stripe/PayPal ready)
- Reviews & ratings system
- Admin dashboard endpoints
- API documentation with Swagger

---

## 📖 API Documentation

### Quick Reference

# E-Commerce Backend API Endpoints

## Auth

- `POST /auth/register` → Register a new user
- `POST /auth/login` → Login & get token
- `POST /auth/logout` → Logout user
- `GET /auth/profile` → Get logged-in user profile
- `PUT /auth/profile` → Update logged-in user profile
- `PUT /auth/change-password` → Change password
- `POST /auth/reset-password` → Request password reset

## Users (Admin only)

- `GET /users` → List all users
- `GET /users/:id` → Get user details
- `PUT /users/:id` → Update user info
- `DELETE /users/:id` → Delete user

## Products

- `GET /products` → List all products
- `GET /products/:id` → Get product details
- `POST /products` → Create product (admin only)
- `PUT /products/:id` → Update product (admin only)
- `DELETE /products/:id` → Delete product (admin only)
- `GET /products/category/:categoryId` → List products by category
- `GET /products/search?query=keyword` → Search products by name or keyword

## Categories

- `GET /categories` → List all categories
- `GET /categories/:id` → Get category details
- `POST /categories` → Create category (admin only)
- `PUT /categories/:id` → Update category (admin only)
- `DELETE /categories/:id` → Delete category (admin only)

## Cart

- `GET /cart` → Get logged-in user cart
- `POST /cart` → Add item to cart
- `PUT /cart/:itemId` → Update item quantity in cart
- `DELETE /cart/:itemId` → Remove item from cart

## Orders

- `POST /orders` → Create new order
- `GET /orders` → List logged-in user’s orders
- `GET /orders/:id` → Get order details
- `PUT /orders/:id` → Update order status (admin only)
- `DELETE /orders/:id` → Cancel order (user or admin)

## Wishlist

- `GET /wishlist` → Get logged-in user wishlist
- `POST /wishlist` → Add product to wishlist
- `DELETE /wishlist/:itemId` → Remove item from wishlist

## Reviews / Ratings

- `GET /products/:id/reviews` → Get reviews for a product
- `POST /products/:id/reviews` → Add a review for a product
- `PUT /reviews/:id` → Update a review (author only)
- `DELETE /reviews/:id` → Delete a review (author or admin)

## Admin Dashboard Extras

- `GET /dashboard/stats` → Get sales, user, and product statistics
- `GET /dashboard/orders` → List all orders
- `GET /dashboard/products/low-stock` → Get products with low stock


➡️ Full list available in [docs/endpoints.md](./src/docs/endpoints.md)

---

## 🛠️ Installation & Setup

```bash
# Clone repo
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run server
npm run dev

```
