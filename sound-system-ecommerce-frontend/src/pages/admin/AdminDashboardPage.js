// src/pages/admin/AdminDashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext'; // To get product count
import { useAuth } from '../../contexts/AuthContext'; // To greet the admin
import './AdminDashboardPage.css'; // We'll create or update this CSS

function AdminDashboardPage() {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { currentUser } = useAuth();

  const totalProducts = products ? products.length : 0;

  // Placeholder for other stats you might want in a real app
  // const totalUsers = 0; // You would get this from a userService if implemented
  // const pendingOrders = 0;

  return (
    <div className="admin-page-container admin-dashboard-page">
      <h2>Admin Dashboard</h2>
      {currentUser && <p className="dashboard-welcome">Welcome back, {currentUser.name || currentUser.email}!</p>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          {productsLoading && <p>Loading...</p>}
          {productsError && <p className="error-text">Error loading products</p>}
          {!productsLoading && !productsError && <p className="stat-value">{totalProducts}</p>}
          <Link to="/admin/products" className="stat-link">Manage Products</Link>
        </div>
        
        {/* Placeholder for more stat cards */}
        {/* <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{totalUsers}</p>
          <Link to="#" className="stat-link disabled-link">Manage Users (TBA)</Link>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value">{pendingOrders}</p>
          <Link to="#" className="stat-link disabled-link">View Orders (TBA)</Link>
        </div> */}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <ul>
          <li>
            <Link to="/admin/products/add" className="admin-button quick-action-button">
              Add New Product
            </Link>
          </li>
          {/* Add other common admin tasks here */}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboardPage;