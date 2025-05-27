// src/pages/admin/AdminProductFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import './AdminProductFormPage.css';
// import './AdminPages.css'; // If you have general admin styles

function AdminProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  // Destructure products, addProduct, updateProduct, loading, error from useProducts
  const { products, addProduct, updateProduct, loading: productsLoading, error: productsError, getProductById } = useProducts();

  const isEditMode = Boolean(productId);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false); // For submit loading state
  const [initialDataLoading, setInitialDataLoading] = useState(isEditMode); // For loading product data in edit mode

  useEffect(() => {
    if (isEditMode) {
      setInitialDataLoading(true);
      const numericProductId = parseInt(productId, 10);
      
      // Option 1: Find from already loaded products list (if available and not loading)
      if (!productsLoading && products.length > 0) {
        const productToEdit = products.find(p => p.id === numericProductId);
        if (productToEdit) {
          setProductName(productToEdit.name);
          setCategory(productToEdit.category || '');
          setPrice(productToEdit.price ? productToEdit.price.toString() : '');
          setDescription(productToEdit.description || '');
          setImageUrl(productToEdit.image || '');
          setInitialDataLoading(false);
          return;
        }
      }
      
      // Option 2: If not found in list or list is loading, fetch individually
      // This makes edit mode more robust if user directly navigates to edit URL
      const fetchProductForEdit = async () => {
        try {
          const productToEdit = await getProductById(numericProductId); // Use getProductById from context
          if (productToEdit) {
            setProductName(productToEdit.name);
            setCategory(productToEdit.category || '');
            setPrice(productToEdit.price ? productToEdit.price.toString() : '');
            setDescription(productToEdit.description || '');
            setImageUrl(productToEdit.image || '');
          } else {
            console.error(`Product with ID ${productId} not found for editing.`);
            setFormError(`Product with ID ${productId} not found.`);
            // Optionally navigate back or show a more prominent error
            // navigate('/admin/products'); 
          }
        } catch (err) {
          console.error(`Error fetching product ${productId} for edit:`, err);
          setFormError(err.message || 'Failed to load product data for editing.');
        } finally {
          setInitialDataLoading(false);
        }
      };

      if (numericProductId) { // Only fetch if productId is valid
          fetchProductForEdit();
      } else {
          setInitialDataLoading(false); // No valid productId to fetch
          setFormError("Invalid Product ID for editing.");
      }

    } else {
      setInitialDataLoading(false); // Not edit mode, no initial data to load
    }
  }, [productId, products, isEditMode, navigate, productsLoading, getProductById]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!productName || !category || !price || !description) {
      setFormError('Please fill in all required fields: Name, Category, Price, Description.');
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }

    const productData = {
      name: productName,
      category,
      price: priceValue,
      description,
      image: imageUrl || undefined, 
    };

    setFormLoading(true);
    try {
      if (isEditMode) {
        const numericProductId = parseInt(productId, 10);
        await updateProduct(numericProductId, productData);
      } else {
        await addProduct(productData);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      setFormError(error.message || 'Failed to save product. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (initialDataLoading && isEditMode) {
    return (
        <div className="admin-page-container admin-product-form-page">
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="loading-message">Loading product data for editing...</p>
        </div>
    );
  }
  
  if (productsError && isEditMode && initialDataLoading) { // If general products list error affects edit form
    return (
        <div className="admin-page-container admin-product-form-page">
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="error-message">Error loading initial product data: {productsError}</p>
        </div>
    );
  }


  return (
    <div className="admin-page-container admin-product-form-page">
      <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        {formError && <p className="form-error-message">{formError}</p>}
        <div className="form-group">
          <label htmlFor="productName">Product Name <span className="required-asterisk">*</span></label>
          <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} disabled={formLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category <span className="required-asterisk">*</span></label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} disabled={formLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price ($) <span className="required-asterisk">*</span></label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" min="0.01" disabled={formLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description <span className="required-asterisk">*</span></label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" disabled={formLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" disabled={formLoading} />
        </div>
        <div className="form-actions">
          <button type="submit" className="admin-button save-button" disabled={formLoading}>
            {formLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Product' : 'Add Product')}
          </button>
          <button type="button" className="admin-button cancel-button" onClick={() => navigate('/admin/products')} disabled={formLoading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductFormPage;