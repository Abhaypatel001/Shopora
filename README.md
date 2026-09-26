🔗 Live Link: https://shopora-pi-nine.vercel.app/


Shopora 🛍️

Shopora is a modern full-stack e-commerce web application built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

The project is designed as a complete shopping platform with customer authentication, product browsing, search, cart, wishlist, checkout, order management, account/address management, admin tools, Cloudinary image uploads, and external product discovery through SerpApi Google Shopping.

✨ Project Highlights

🛒 Full e-commerce shopping flow

🔐 User registration and login

👤 Customer account management

📦 Product details and stock handling

🛍️ Add to cart / update quantity / remove items

❤️ Wishlist system

📍 Saved delivery addresses

💳 Checkout with:

Cash on Delivery

Demo Online Payment

📦 Order placement and order history

🔎 Product search with category selection

⚡ Search autocomplete with:

Debouncing

Typo-tolerant matching

Keyboard navigation

🌐 External product search using SerpApi

🧾 Separate external-product detail page

👨‍💼 Admin dashboard

📊 Admin order management

👥 Admin user management

🎧 Admin customer support section

☁️ Cloudinary image upload support

📱 Responsive design for desktop, tablet and mobile

🎨 Premium Amazon-style e-commerce UI

🖥️ Local-network mobile testing support

🧰 Tech Stack

Frontend

React

Vite

React Router

Axios

JavaScript (ES6+)

CSS3

Responsive layout

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT-based authentication

Axios

Multer

Cloudinary

dotenv

CORS

External Search

SerpApi

Google Shopping API

Database

MongoDB / MongoDB Atlas

📁 Project Structure

shopora/
│
├── src/
│   ├── Components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Cart.jsx
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── ExternalProductDetails.jsx
│   │   ├── Search.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminSupport.jsx
│   │   ├── Category.jsx
│   │   ├── StoreCollection.jsx
│   │   ├── CustomerService.jsx
│   │   ├── Account.jsx
│   │   ├── Wishlist.jsx
│   │   └── Addresses.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── Middleware/
│   ├── Services/
│   ├── utils/
│   ├── Server.js
│   ├── package.json
│   └── .env
│
├── package.json
└── README.md

Folder/file names may vary slightly depending on the latest local version of the project.

🚀 Getting Started

1. Clone / open the project

cd shopora

💻 Frontend Setup

Go to the project root:

cd C:\Users\abhay\Desktop\shopora

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend normally runs on:

http://localhost:5173

⚙️ Backend Setup

Open another terminal:

cd C:\Users\abhay\Desktop\shopora\backend

Install backend dependencies:

npm install

Start the backend in development mode:

npm run dev

The backend runs on:

http://localhost:5000

🔐 Environment Variables

Create a .env file inside the backend folder.

Example structure:

PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_JWT_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

SERPAPI_KEY=YOUR_SERPAPI_KEY

Important

Never commit real API keys, passwords, database credentials, or secrets to GitHub.

Use a .gitignore file and keep:

.env
node_modules/
dist/

out of the repository.

🗄️ MongoDB

Shopora stores application data in MongoDB.

Main data areas include:

Users

Products

Orders

Wishlist references

Saved addresses

MongoDB can be used locally or through MongoDB Atlas.

Example MongoDB local connection:

mongodb://127.0.0.1:27017/shopora

🔐 Authentication

Shopora uses token-based authentication.

The general flow is:

Register
   ↓
Login
   ↓
JWT token
   ↓
Authenticated API requests
   ↓
User / Admin access

Protected routes use the logged-in user's authentication token.

Admin-only sections are restricted through admin authorization middleware.

👤 User Features

Customers can:

Register an account

Login

Logout

View their profile

Update name and email

Update password

Manage saved addresses

Browse products

Search products

View product details

Add products to cart

Update cart quantity

Remove cart items

Add/remove wishlist items

Checkout

Select COD or demo online payment

Place orders

View order history

View individual order details

❤️ Wishlist

The wishlist is stored for the authenticated user.

Supported actions:

Add to Wishlist
Remove from Wishlist
View Wishlist
Wishlist Count

The Navbar also updates its wishlist count when wishlist changes.

🛒 Cart

The cart supports:

Add product

Increase quantity

Decrease quantity

Remove product

Calculate subtotal

Calculate total

Proceed to checkout

The final order is validated on the backend before it is created.

📦 Products

The product model supports information such as:

Product name

Category

Price

Old price

Rating

Review count

Image

Cloudinary image public ID

Description

Stock

Section

Sort order

Created/updated timestamps

Example categories used in the UI:

Mobiles
Fashion
Electronics
Home & Kitchen
Books
Beauty
Grocery
Sports

☁️ Cloudinary

Cloudinary is used for product image storage.

Typical upload flow:

Admin selects image
       ↓
Multer receives image
       ↓
Backend uploads to Cloudinary
       ↓
Cloudinary returns image URL
       ↓
MongoDB stores image information

The backend also uses an upload size/type restriction for product images.

🔎 Product Search

Shopora supports local database search as well as external product discovery.

Local Search

The search system can search products already stored in the Shopora MongoDB database.

Smart Search Autocomplete

The Navbar search includes:

Debounced suggestions

Typo-tolerant matching

Product suggestions

Arrow Up / Arrow Down navigation

Enter to search

Escape to close

Outside-click closing

Example search flow:

User types:
"iphon"

        ↓

Autocomplete suggestions

        ↓

User selects / searches

        ↓

Shopora search results

🌐 External Product Search

Shopora also supports finding products that are not stored in its own MongoDB database.

The integration uses:

SerpApi
    ↓
Google Shopping results
    ↓
Shopora backend
    ↓
Search page

Backend endpoint:

GET /api/external-products/search?q=PRODUCT_NAME

The server sends the query to SerpApi and converts the response into Shopora-friendly product objects.

External products are shown separately from Shopora's internal products.

They are marked as:

🌐 External

External product cards can display:

Product title

Price

Old price

Rating

Reviews

Store/source

Delivery information

Product image

🔗 External Product Details

External products do not automatically become Shopora products.

Instead, Shopora opens a dedicated route:

/external-product/:id

The page allows the user to:

View product information

View image

View price

View source/store

View rating/reviews

View delivery information

Continue searching

Open the original store listing

The external listing can be opened using:

Buy from Store ↗

Price and availability may change on the external store.

🧾 Checkout

The project currently uses two demo checkout methods:

Cash on Delivery
Demo Online Payment

The online payment flow is simulated for project/demo purposes.

No live payment gateway is required for the current implementation.

📦 Orders

When an order is placed, the backend performs server-side validation.

The order flow includes:

Cart
 ↓
Checkout
 ↓
Server validates products
 ↓
Server uses database prices
 ↓
Stock is checked
 ↓
Stock is reduced
 ↓
Order is created

The backend prevents the frontend from simply choosing a different product price during checkout.

🧑‍💼 Admin Panel

Shopora includes an admin section.

Admin areas include:

/admin
/admin/products
/admin/orders
/admin/users
/admin/support

Admin functionality includes:

Dashboard

Product management

Order management

User management

Customer support management

Admin routes are protected so regular customers cannot access admin-only features.

📋 Main API Routes

Authentication

Typical authentication area:

/api/auth

Used for:

Register

Login

Authentication-related operations

Users

/api/users

Includes user-related operations such as:

GET    /users/me
PUT    /users/me
PATCH  /users/me/password

Addresses

GET    /api/users/addresses
POST   /api/users/addresses
PUT    /api/users/addresses/:addressId
DELETE /api/users/addresses/:addressId
PATCH  /api/users/addresses/:addressId/default

Wishlist

GET    /api/users/wishlist
POST   /api/users/wishlist/:productId
DELETE /api/users/wishlist/:productId

Products

The product API is used for:

GET    /api/products
GET    /api/products/:id

Admin product-management routes can provide additional create/update/delete operations depending on the backend implementation.

Orders

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
GET    /api/orders/admin/all
PATCH  /api/orders/:id/status

The admin order list and status update routes require admin authorization.

External Products

GET /api/external-products/search?q=iphone

🖥️ Important Frontend Routes

Main public/customer routes include:

/
 /jobs
 /product/:id
 /products/:id
 /external-product/:id
 /search
 /login
 /register
 /account
 /cart
 /checkout
 /orders
 /orders/:id
 /wishlist
 /addresses
 /help
 /c/:category

Admin routes:

/admin
/admin/products
/admin/orders
/admin/users
/admin/support

📱 Mobile / Local Network Testing

To test Shopora on a mobile phone while the project is running on a laptop, both devices should be connected to the same Wi-Fi/hotspot network.

Run Vite with host exposure:

npm run dev -- --host 0.0.0.0

or:

npx vite --host 0.0.0.0

Then Vite should show a network URL similar to:

http://10.190.3.54:5173

Open that network URL on the mobile.

Backend note

For mobile testing, the frontend API base URL must point to the laptop's network IP rather than:

http://localhost:5000

Example:

http://10.190.3.54:5000/api

This is necessary because localhost on a mobile device refers to the mobile device itself.

🎨 UI / Design

The frontend uses a centralized stylesheet:

src/index.css

The UI includes:

Responsive Navbar

Search autocomplete

Hero banner carousel

Category cards

Product cards

Promotional banners

Trust/benefits strip

Cart UI

Authentication forms

Account pages

Wishlist

Orders

Address management

External product pages

Mobile-specific responsive adjustments

The home hero supports:

Automatic slide change

Arrow navigation

Dot navigation

Mobile touch swipe

Laptop touchpad horizontal swipe

Mouse drag interaction

🏠 Home Page Sections

The Shopora home page contains:

Hero slider

Categories

Deals

Trending products

Promotional banners

Trust/benefits information

Footer

Example hero themes include:

Everyday tech savings

New season fashion

Home & kitchen offers

🧩 Important Components

Navbar

The Navbar contains:

Shopora logo

Delivery location

Category selector

Search box

Autocomplete

Account menu

Wishlist/cart access

Responsive mobile controls

Footer

The Footer contains:

Brand information

Shop links

Account links

Customer support

Admin links where applicable

Benefits strip

Legal/footer information

🧪 Development

Frontend:

npm run dev

Backend:

npm run dev

Production frontend build:

npm run build

Preview a production build:

npm run preview

🔍 Troubleshooting

Frontend opens on laptop but not mobile

Check:

Laptop and phone are on the same network

Vite is running with --host

Windows Firewall is not blocking the port

Mobile is using the Vite Network URL, not localhost

Products are not loading on mobile

Check the frontend API base URL.

Do not use:

http://localhost:5000/api

for mobile access.

Use the laptop's network IP:

http://YOUR_LAPTOP_IP:5000/api

Also make sure the backend is running.

Backend shows Cannot GET /

This normally means the browser is requesting a route that is not registered for that path.

Use the API route with its correct prefix, for example:

/api/products
/api/orders
/api/external-products/search?q=phone

rather than opening the API root and expecting a frontend page.

External products are not appearing

Check:

SERPAPI_KEY exists in backend .env

Backend was restarted after changing .env

The SerpApi request is successful

The query contains a valid search term

The browser can reach the backend

The backend logs useful debugging information for the SerpApi request.

🔒 Security Notes

For a production deployment:

Do not expose .env

Use strong JWT secrets

Validate all incoming request data

Keep admin authorization server-side

Validate order prices and stock on the backend

Use HTTPS

Restrict CORS appropriately

Add rate limiting

Add stronger password/security policies

Monitor external API usage

📌 Important Project Notes

External products

External products returned by SerpApi are third-party listings.

They are not automatically inserted into the Shopora MongoDB product collection.

Demo online payment

The current online payment mode is a demonstration flow rather than a live payment gateway.

Stock management

Orders validate stock against the database before completing the order.

🚀 Future Improvements

Possible next-stage features:

Real payment gateway integration

Product reviews and user ratings

Coupon system

Advanced filters

Pagination

Product recommendations

Recently viewed products

AI-powered recommendations

Seller/vendor accounts

Live order tracking

Email notifications

Push notifications

Product comparison

Better analytics dashboard

Deployment with production environment variables

👨‍💻 Project Purpose

Shopora is built as a complete full-stack e-commerce project demonstrating:

Frontend development

React component architecture

Routing

REST API integration

Authentication

MongoDB database design

CRUD operations

Image storage

Cart and wishlist logic

Order processing

Admin authorization

Third-party API integration

Responsive UI development

Mobile local-network testing

📄 License

This project is intended for educational, portfolio, and demonstration purposes.

Add your preferred license here before public/commercial distribution.

⭐ Shopora

A complete modern e-commerce experience built with React, Node.js, Express and MongoDB.

Browse → Search → Discover → Add to Cart → Checkout → Order
