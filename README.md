# Paradise Nursery 🌿

**Paradise Nursery** is a dynamic, single-page e-commerce web application built with **React** and **Redux Toolkit** that lets customers browse a curated selection of houseplants, view plant details (thumbnail, name, description, and price), and manage a fully interactive shopping cart.

## About the Project

Paradise Nursery began as a small local plant shop with a mission to bring greenery, freshness, and calm into people's homes. This project brings that mission online, allowing customers to explore houseplants organized by category, add their favorites to a cart, and adjust quantities before checkout.

This is the final project for the course, combining everything learned in earlier practice projects into one complete, functional shopping application.

## Features

- **Landing Page** – A welcoming hero section with the Paradise Nursery brand, a background image, and a "Get Started" button that leads into the shop.
- **About Us Page** – Company background and mission.
- **Product Listing Page**
  - Plants organized into multiple categories (Succulents, Air Purifying Plants, Aromatic Plants).
  - Each plant card shows a thumbnail, name, and price.
  - "Add to Cart" button that adds the plant to the cart, disables itself once clicked, and increments the cart icon count.
  - Persistent navbar with links to Home, Plants, and Cart.
  - Live cart icon showing the total number of items in the cart.
- **Shopping Cart Page**
  - Each cart item displays a thumbnail, name, and unit price.
  - Increase/decrease quantity buttons that update the line total and cart total in real time.
  - Delete button to remove an item from the cart entirely.
  - Running total cost for each item and for the entire cart.
  - "Checkout" button that displays a "Coming Soon" message.
  - "Continue Shopping" button that returns to the Product Listing page.

## Tech Stack

- React (functional components + hooks)
- Redux Toolkit (`createSlice`) for cart state management
- React-Redux (`useSelector`, `useDispatch`)
- CSS (custom styles, background imagery, responsive layout)

## Project Structure

```
paradise-nursery/
├── public/
├── src/
│   ├── components/
│   │   ├── AboutUs.jsx
│   │   ├── ProductList.jsx
│   │   └── CartItem.jsx
│   ├── redux/
│   │   ├── CartSlice.jsx
│   │   └── store.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── README.md
```

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/paradise-nursery.git
   cd paradise-nursery
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the development server
   ```bash
   npm run dev
   ```
4. Open the app in your browser at `http://localhost:5173`

## Author

Built as the capstone project for the Paradise Nursery Shopping Application course assignment.
