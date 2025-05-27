// src/components/common/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { cartItems } = useCart();
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth(); // currentUser might be used for greeting later
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null); 

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); 
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          Minerva Pro Audio
        </Link>
      </div>

      <button className="navbar-toggler" onClick={toggleMobileMenu} aria-label="Toggle navigation">
        &#9776; 
      </button>

      <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
        <li><Link to="/products" onClick={closeMobileMenu}>Products</Link></li>
        
        {/* Conditionally render Cart link only if NOT admin */}
        {!isAdmin && (
          <li>
            <Link to="/cart" className="navbar-cart-link" onClick={closeMobileMenu}>
              Cart ({totalItemsInCart})
            </Link>
          </li>
        )}

        {isAuthenticated ? (
          <>
            <li><Link to="/profile" onClick={closeMobileMenu}>Profile</Link></li>
            {isAdmin && (
              <li><Link to="/admin/dashboard" onClick={closeMobileMenu}>Admin</Link></li>
            )}
            <li>
              <button onClick={handleLogout} className="navbar-button-link">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={closeMobileMenu}>Login</Link></li>
            <li><Link to="/register" onClick={closeMobileMenu}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
export default Navbar;