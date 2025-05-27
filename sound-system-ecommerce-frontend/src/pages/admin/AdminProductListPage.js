// src/pages/admin/AdminProductListPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import './AdminProductListPage.css'; 
// Ensure you have general admin page styles if .admin-page-container is used
// import './AdminPages.css'; 

function AdminProductListPage() {
  const { products, deleteProduct, loading, error } = useProducts();
  const navigate = useNavigate();

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        // setError(''); // Clear previous errors if any
        // alert('Product deleted successfully'); // Optional notification
      } catch (err) {
        console.error("Failed to delete product on page:", err);
        // setError(err.message || 'Failed to delete product'); // Display error from context or custom
        alert(err.message || 'Failed to delete product. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-page-container admin-product-list-page">
        <div className="admin-header"><h2>Manage Products</h2></div>
        <p className="loading-message">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-container admin-product-list-page">
        <div className="admin-header"><h2>Manage Products</h2></div>
        <p className="error-message">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container admin-product-list-page">
      <div className="admin-header">
        <h2>Manage Products</h2>
        <Link to="/admin/products/add" className="admin-button add-product-button">
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products found. Add some!</p>
      ) : (
        <table className="admin-product-table responsive-admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td data-label="ID">{product.id}</td>
                <td data-label="Image">
                  <img 
                    src={product.image || 'https://via.placeholder.com/50x50.png?text=NoImg'} 
                    alt={product.name} 
                    className="product-list-image" 
                  />
                </td>
                <td data-label="Name">{product.name}</td>
                <td data-label="Category">{product.category}</td>
                <td data-label="Price">${product.price ? product.price.toFixed(2) : 'N/A'}</td>
                <td data-label="Actions" className="actions-cell">
                  <button 
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)} 
                    className="admin-button edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="admin-button delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProductListPage;