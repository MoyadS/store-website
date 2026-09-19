# 🛍️ Store Website

A full-stack e-commerce store built with Node.js, Express, and MongoDB — featuring a shopping cart, order management, JWT authentication, and input validation.

🔗 **Live Demo:** [ضع رابط Render هون](https://store-website-rnk9.onrender.com)

## Features

- 🛒 Shopping cart with localStorage persistence
- 📦 Server-side order processing with real-time stock and price validation
- 🔐 Admin authentication using bcrypt password hashing and JWT tokens
- ✅ Input validation on all product data (name, price, stock, description)
- 👨‍💼 Full admin panel: add, edit, and delete products
- 🧾 Order history view for admins
- ☁️ Deployed with MongoDB Atlas (cloud database) and Render (hosting)

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose
**Auth:** bcrypt, JSON Web Tokens (JWT)
**Validation:** express-validator
**Frontend:** Vanilla JavaScript, HTML, CSS
**Deployment:** Render, MongoDB Atlas

## Project Structure

store-website/
- admin/ (Admin panel: login, add/edit/delete products, view orders)
- middleware/ (Auth & validation middleware)
- models/ (Mongoose schemas: Product, Order, Admin)
- public/ (Customer-facing store: cart, checkout)
- routes/ (Express API routes)
- scripts/ (One-off scripts: admin account creation)
- server.js (App entry point)

## Running Locally

1. Clone the repo: git clone https://github.com/MoyadS/store-website.git and cd store-website

2. Install dependencies: npm install

3. Create a .env file in the root directory with:
JWT_SECRET=your_secret_key
MONGO_URI=your_mongodb_connection_string
PORT=5000

4. Create an admin account: node scripts/createAdmin.js (edit the username/password inside the script first)

5. Start the server: node server.js

6. Visit http://localhost:5000

## Author

**Moyad S.**
[GitHub](https://github.com/MoyadS)