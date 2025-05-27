// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';

// Component Imports
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminProtectedRoute from './components/routing/AdminProtectedRoute';

// Context Provider Imports
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// CSS Imports
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <div className="App">
              <Navbar />
              <div className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:productId" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />

                  {/* User Protected Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboardPage />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminProtectedRoute>
                        <AdminProductListPage />
                      </AdminProtectedRoute>
                    }
                  />
                  {/* ADD THIS ROUTE FOR ADDING PRODUCTS */}
                  <Route
                    path="/admin/products/add"
                    element={
                      <AdminProtectedRoute>
                        <AdminProductFormPage />
                      </AdminProtectedRoute>
                    }
                  />
                  {/* ADD THIS ROUTE FOR EDITING PRODUCTS */}
                  <Route
                    path="/admin/products/edit/:productId"
                    element={
                      <AdminProtectedRoute>
                        <AdminProductFormPage />
                      </AdminProtectedRoute>
                    }
                  />
                </Routes>
              </div>
              <Footer />
            </div>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;