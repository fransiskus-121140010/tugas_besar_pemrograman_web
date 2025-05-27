// src/pages/ProductsPage.js
import React from 'react';
import ProductCard from '../components/Product/ProductCard';
import { useProducts } from '../contexts/ProductContext';
import './ProductsPage.css';

function ProductsPage() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="products-page">
        <h1>Our Sound Systems</h1>
        <p className="loading-message">Loading all our sound systems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <h1>Our Sound Systems</h1>
        <p className="error-message">Error loading products: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="products-page">
        <h1>Our Sound Systems</h1>
        <p>No products available at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1>Our Sound Systems</h1>
      <div className="products-list">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;