import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, incrementQuantity, decrementQuantity } from '../redux/CartSlice';

function CartItem({ onContinueShopping }) {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const calculateItemTotal = (item) => item.price * item.quantity;

  const calculateTotalAmount = () =>
    cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleIncrement = (item) => {
    dispatch(incrementQuantity(item.name));
  };

  const handleDecrement = (item) => {
    dispatch(decrementQuantity(item.name));
  };

  const handleRemove = (item) => {
    dispatch(removeItem(item.name));
  };

  const handleCheckout = () => {
    alert('Coming Soon! Checkout functionality is not yet available.');
  };

  return (
    <div className="cart-page">
      <nav className="navbar">
        <div className="navbar-brand" onClick={onContinueShopping}>
          🌿 Paradise Nursery
        </div>
        <div className="navbar-links">
          <span className="nav-link" onClick={onContinueShopping}>Home</span>
          <span className="nav-link" onClick={onContinueShopping}>Plants</span>
          <span className="nav-link cart-link">
            🛒 Cart
            <span className="cart-count">{totalQuantity}</span>
          </span>
        </div>
      </nav>

      <div className="cart-content">
        <h1>Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty. Head back to add some plants!</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.name} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-thumbnail" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">Unit Price: ${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleDecrement(item)}>-</button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button onClick={() => handleIncrement(item)}>+</button>
                  </div>
                  <p className="cart-item-total">
                    Total: ${calculateItemTotal(item).toFixed(2)}
                  </p>
                  <button className="delete-btn" onClick={() => handleRemove(item)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-summary">
          <h2>Total Cart Amount: ${calculateTotalAmount().toFixed(2)}</h2>
          <div className="cart-actions">
            <button className="continue-shopping-btn" onClick={onContinueShopping}>
              Continue Shopping
            </button>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
