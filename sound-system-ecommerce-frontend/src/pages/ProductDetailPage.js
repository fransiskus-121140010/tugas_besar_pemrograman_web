// src/pages/ProductDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import './ProductDetailPage.css';

const placeholderImage = 'https://via.placeholder.com/600x400.png?text=Sound+System+Detail';

function ProductDetailPage() {
  const { productId } = useParams();
  const { products, loading: productsListLoading, error: productsListError, getProductById } = useProducts();
  const { addToCart } = useCart();
  const { isAdmin, isAuthenticated } = useAuth(); // Get isAdmin and isAuthenticated

  const [product, setProduct] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    const numericProductId = parseInt(productId, 10);
    
    if (!productsListLoading && products.length > 0) {
      const foundProduct = products.find(p => p.id === numericProductId);
      if (foundProduct) {
        setProduct(foundProduct);
        setPageLoading(false);
        setPageError(null);
        return;
      }
    }
    
    if (!productsListLoading) {
        const fetchProduct = async () => {
            try {
                setPageLoading(true);
                setPageError(null);
                const fetchedProduct = await getProductById(numericProductId);
                setProduct(fetchedProduct);
            } catch (err) {
                setPageError(err.message || `Product with ID ${productId} not found.`);
                setProduct(null);
            } finally {
                setPageLoading(false);
            }
        };
        if (numericProductId) {
            fetchProduct();
        } else {
            setPageError("Invalid Product ID.");
            setPageLoading(false);
        }
    } else if (productsListLoading) {
        setPageLoading(true);
    }
  }, [productId, products, productsListLoading, getProductById]);

  const handleAddToCart = () => {
    if (product && !isAdmin) { // Add check for !isAdmin
      addToCart(product);
      alert(`${product.name} added to cart!`); // Simple feedback
    } else if (isAdmin) {
      alert("Admin users cannot add items to the cart.");
    }
  };
  
  if (pageLoading) return <div className="product-detail-page-message"><p>Loading product details...</p></div>;
  if (pageError) return <div className="product-detail-page-message error"><p>{pageError}</p><Link to="/products">Back to Products</Link></div>;
  if (!product) return <div className="product-detail-page-message"><p>Product Not Found</p><Link to="/products">Back to Products</Link></div>;

  const imageUrl = product.image || placeholderImage;

  return (
    <div className="product-detail-page">
      <Link to="/products" className="back-link">&larr; Back to Products</Link>
      <div className="product-detail-content">
        <div className="product-detail-image-container">
          <img src={imageUrl} alt={product.name} className="product-detail-image" />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-category">Category: {product.category || 'N/A'}</p>
          <p className="product-detail-description">{product.description || 'No description available.'}</p>
          <h2 className="product-detail-price">${product.price ? product.price.toFixed(2) : 'N/A'}</h2>
          
          {/* Conditionally render Add to Cart button only if authenticated and NOT admin */}
          {isAuthenticated && !isAdmin && (
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
          )}
          {/* Optional: Show a message or different button for admin, or nothing */}
          {isAuthenticated && isAdmin && (
            <p className="admin-cart-notice">Product management view (Admins cannot shop).</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;