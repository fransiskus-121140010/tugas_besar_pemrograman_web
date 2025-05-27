// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/Product/ProductCard';
import './HomePage.css'; // We'll create this CSS file

function HomePage() {
  const { products, loading, error } = useProducts();

  // Get a few products to feature (e.g., the first 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Minerva Pro Audio</h1>
          <p className="hero-subtitle">Your one-stop shop for premium sound systems and audio equipment.</p>
          <Link to="/products" className="hero-button">Shop All Products</Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <h2>Featured Products</h2>
        {loading && <p className="loading-message">Loading featured products...</p>}
        {error && <p className="error-message">Error loading products: {error}</p>}
        {!loading && !error && featuredProducts.length === 0 && (
          <p>No featured products available at the moment.</p>
        )}
        {!loading && !error && featuredProducts.length > 0 && (
          <div className="products-list homepage-products-list">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Optional: Categories Section Placeholder */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="category-links">
          <Link to="/products?category=speakers" className="category-link-item">Speakers</Link>
          <Link to="/products?category=headphones" className="category-link-item">Headphones</Link>
          <Link to="/products?category=amplifiers" className="category-link-item">Amplifiers</Link>
          <Link to="/products?category=earbuds" className="category-link-item">Earbuds</Link>
          {/* Add more categories as needed, link to filtered product pages */}
        </div>
      </section>
    </div>
  );
}

export default HomePage;