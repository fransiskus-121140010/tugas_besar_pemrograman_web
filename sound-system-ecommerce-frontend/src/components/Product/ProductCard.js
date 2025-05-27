// src/components/Product/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './ProductCard.css';

const placeholderImage = 'https://via.placeholder.com/300x200.png?text=Sound+System';

function ProductCard({ product }) {
  const imageUrl = product.image || placeholderImage;

  return (
    <div className="product-card">
      <img src={imageUrl} alt={product.name} className="product-card-image" />
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-category">{product.category || 'Sound System'}</p>
        <p className="product-card-price">${product.price ? product.price.toFixed(2) : 'N/A'}</p>
        {/* Update button to be a Link */}
        <Link to={`/products/${product.id}`} className="product-card-button">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;