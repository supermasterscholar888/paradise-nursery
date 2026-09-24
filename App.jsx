import React, { useState } from 'react';
import './App.css';
import AboutUs from './components/AboutUs';
import ProductList from './components/ProductList';
import CartItem from './components/CartItem';

function App() {
  // 'landing' | 'products' | 'cart'
  const [currentPage, setCurrentPage] = useState('landing');

  const goToProducts = () => setCurrentPage('products');
  const goToCart = () => setCurrentPage('cart');
  const goToLanding = () => setCurrentPage('landing');

  if (currentPage === 'products') {
    return <ProductList onHomeClick={goToLanding} onCartClick={goToCart} />;
  }

  if (currentPage === 'cart') {
    return <CartItem onContinueShopping={goToProducts} />;
  }

  return (
    <div className="landing-page">
      <div className="landing-overlay">
        <h1 className="landing-title">Paradise Nursery</h1>
        <p className="landing-tagline">
          Bringing nature's calm into your everyday space.
        </p>
        <button className="get-started-btn" onClick={goToProducts}>
          Get Started
        </button>
      </div>
      <AboutUs />
    </div>
  );
}

export default App;
