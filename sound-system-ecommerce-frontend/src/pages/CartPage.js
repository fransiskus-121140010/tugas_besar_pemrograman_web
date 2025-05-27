// src/pages/CartPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

function CartPage() {
  // Destructure clearCart from useCart
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cartItems.length === 0) {
    // ... (empty cart logic remains the same)
    return (
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>
        <p>Your cart is currently empty.</p>
        <Link to="/products" className="button-primary">Continue Shopping</Link>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId, currentQuantity, change) => {
    // ... (handleQuantityChange logic remains the same)
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    } else if (newQuantity === 0) {
      updateQuantity(productId, 1);
    }
  };

  const handleQuantityInputChange = (productId, event) => {
    // ... (handleQuantityInputChange logic remains the same)
    let newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleClearCart = () => {
    // Optional: Add a confirmation dialog
    if (window.confirm('Are you sure you want to empty your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      {/* Add Clear Cart button if cart is not empty */}
      {cartItems.length > 0 && (
        <div className="cart-actions">
          <button onClick={handleClearCart} className="button-danger clear-cart-button">
            Clear Entire Cart
          </button>
        </div>
      )}
      <div className="cart-items-list">
        {/* ... (cartItems.map logic remains the same) ... */}
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image-container">
              <img src={item.image || 'https://via.placeholder.com/100x100.png?text=No+Image'} alt={item.name} className="cart-item-image" />
            </div>
            <div className="cart-item-details">
              <h2>{item.name}</h2>
              <p>Price: ${item.price.toFixed(2)}</p>
              <div className="cart-item-quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                  className="quantity-button"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityInputChange(item.id, e)}
                  className="quantity-input"
                  min="1"
                />
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                  className="quantity-button"
                >
                  +
                </button>
              </div>
            </div>
            <div className="cart-item-subtotal">
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="cart-item-remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Cart Total: ${calculateTotalPrice()}</h2>
        <button className="button-primary checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default CartPage;