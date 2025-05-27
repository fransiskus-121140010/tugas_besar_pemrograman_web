// src/contexts/ProductContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      console.error("ProductContext: Failed to fetch products:", err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    setLoading(true); // Indicate loading for CUD operation
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      // Re-fetch the list to reflect the new product.
      // Or, more optimistically: setProducts(prev => [...prev, response.data]);
      await fetchProducts(); 
      return response.data; 
    } catch (err) {
      console.error("ProductContext: Failed to add product:", err);
      setError(err.message || 'Failed to add product');
      throw err; 
    } finally {
      setLoading(false); // Reset loading after operation
    }
  };

  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.updateProduct(productId, updatedData);
      // Re-fetch or update state optimistically
      await fetchProducts();
      return response.data;
    } catch (err) {
      console.error("ProductContext: Failed to update product:", err);
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(productId);
      // Re-fetch or update state optimistically
      await fetchProducts();
    } catch (err) {
      console.error("ProductContext: Failed to delete product:", err);
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // This function can be used by ProductDetailPage if it needs to fetch independently
  const getProductById = useCallback(async (id) => {
    try {
        setLoading(true); // May want a specific loading state for single product
        setError(null);
        const response = await productService.getProductById(id);
        return response.data;
    } catch (err) {
        console.error(`ProductContext: Failed to fetch product ${id}:`, err);
        setError(err.message || `Failed to fetch product ${id}`);
        throw err; // Re-throw for the page to handle
    } finally {
        setLoading(false);
    }
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts, // For manual refresh if needed elsewhere
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}