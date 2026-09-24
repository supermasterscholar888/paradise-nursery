import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../redux/CartSlice';
import productsData from './productsData';

function ProductList({ onHomeClick, onCartClick }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Track which plant names have already been added, so their button disables
  const [addedPlants, setAddedPlants] = useState({});

  const handleAddToCart = (plant) => {
    dispatch(addItem(plant));
    setAddedPlants((prev) => ({ ...prev, [plant.name]: true }));
  };

  return (
    <div className="product-list-page">
      <nav className="navbar">
        <div className="navbar-brand" onClick={onHomeClick}>
          🌿 Paradise Nursery
        </div>
        <div className="navbar-links">
          <span className="nav-link" onClick={onHomeClick}>Home</span>
          <span className="nav-link" onClick={() => document.getElementById('plants-section').scrollIntoView({ behavior: 'smooth' })}>
            Plants
          </span>
          <span className="nav-link cart-link" onClick={onCartClick}>
            🛒 Cart
            <span className="cart-count">{totalQuantity}</span>
          </span>
        </div>
      </nav>

      <div id="plants-section" className="product-list-content">
        <h1>Our Houseplants</h1>
        {productsData.map((category) => (
          <div key={category.category} className="category-section">
            <h2>{category.category}</h2>
            <div className="plant-grid">
              {category.plants.map((plant) => (
                <div key={plant.name} className="plant-card">
                  <img src={plant.image} alt={plant.name} className="plant-thumbnail" />
                  <h3>{plant.name}</h3>
                  <p className="plant-description">{plant.description}</p>
                  <p className="plant-price">${plant.price.toFixed(2)}</p>
                  <button
                    className="add-to-cart-btn"
                    disabled={!!addedPlants[plant.name]}
                    onClick={() => handleAddToCart(plant)}
                  >
                    {addedPlants[plant.name] ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
