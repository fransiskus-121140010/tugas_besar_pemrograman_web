// src/components/common/Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // MemoryRouter for testing links
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import Navbar from './Navbar';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useNavigate: () => mockNavigate,
}));

// Helper function to render Navbar with context providers and router
const renderNavbar = (authContextValue, cartContextValue, route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={authContextValue}>
        <CartContext.Provider value={cartContextValue}>
          <Routes>
            <Route path="*" element={<Navbar />} />
             {/* Add dummy routes for links to prevent "No routes matched location" warnings if needed */}
            <Route path="/login" element={<div>Login Page Dummy</div>} />
            <Route path="/register" element={<div>Register Page Dummy</div>} />
            <Route path="/profile" element={<div>Profile Page Dummy</div>} />
            <Route path="/admin/dashboard" element={<div>Admin Dashboard Dummy</div>} />
            <Route path="/cart" element={<div>Cart Page Dummy</div>} />
            <Route path="/" element={<div>Home Page Dummy</div>} />
            <Route path="/products" element={<div>Products Page Dummy</div>} />
          </Routes>
        </CartContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Navbar Component', () => {
  const mockLogout = jest.fn();
  const mockCartItems_empty = [];
  const mockCartItems_withItems = [{ id: 1, name: 'Test Item', quantity: 2, price: 10 }];

  // Reset mocks before each test
  beforeEach(() => {
    mockLogout.mockClear();
    mockNavigate.mockClear();
  });

  describe('Logged Out State', () => {
    const authLoggedOut = {
      isAuthenticated: false,
      isAdmin: false,
      currentUser: null,
      logout: mockLogout,
    };

    it('renders Login and Register links when not authenticated', () => {
      renderNavbar(authLoggedOut, { cartItems: mockCartItems_empty });
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
      expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });
  });

  describe('Logged In State (Normal User)', () => {
    const authNormalUser = {
      isAuthenticated: true,
      isAdmin: false,
      currentUser: { name: 'Test User', email: 'user@example.com' },
      logout: mockLogout,
    };

    it('renders Profile and Logout links when authenticated as normal user', () => {
      renderNavbar(authNormalUser, { cartItems: mockCartItems_empty });
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    });

    it('calls logout and navigates to /login when logout button is clicked', () => {
      renderNavbar(authNormalUser, { cartItems: mockCartItems_empty });
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Logged In State (Admin User)', () => {
    const authAdminUser = {
      isAuthenticated: true,
      isAdmin: true,
      currentUser: { name: 'Admin User', email: 'admin@example.com', isAdmin: true },
      logout: mockLogout,
    };

    it('renders Profile, Admin, and Logout links when authenticated as admin', () => {
      renderNavbar(authAdminUser, { cartItems: mockCartItems_empty });
      expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });
  });

  describe('Cart Item Count', () => {
    const authLoggedOut = { isAuthenticated: false, isAdmin: false, currentUser: null, logout: mockLogout };

    it('displays cart count correctly when cart is empty', () => {
      renderNavbar(authLoggedOut, { cartItems: mockCartItems_empty, /* other cart context values if needed */ });
      expect(screen.getByRole('link', { name: /cart \(0\)/i })).toBeInTheDocument();
    });

    it('displays cart count correctly when cart has items', () => {
      // Calculate total quantity for mockCartItems_withItems
      const totalQuantity = mockCartItems_withItems.reduce((sum, item) => sum + item.quantity, 0);
      renderNavbar(authLoggedOut, { cartItems: mockCartItems_withItems, /* other cart context values */ });
      expect(screen.getByRole('link', { name: new RegExp(`cart \\(${totalQuantity}\\)`, "i") })).toBeInTheDocument();
    });
  });

  it('navigates to correct pages when links are clicked', () => {
      const authLoggedOut = { isAuthenticated: false, isAdmin: false, currentUser: null, logout: mockLogout };
      renderNavbar(authLoggedOut, { cartItems: mockCartItems_empty });

      const homeLink = screen.getByRole('link', { name: /SoundSystemCo/i }); // Logo link
      fireEvent.click(homeLink);
      // In a real test with full routing, you'd check window.location.pathname
      // For MemoryRouter, checking if a dummy component renders for that route is an option,
      // or simply trust that <Link to="..."> works. Here, we mainly test presence.
      expect(homeLink).toHaveAttribute('href', '/');

      const productsLink = screen.getByRole('link', { name: "Products" });
      expect(productsLink).toHaveAttribute('href', '/products');
  });
});