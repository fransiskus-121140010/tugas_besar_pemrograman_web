// src/contexts/CartContext.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

// Mock product data for tests
const mockProduct1 = { id: 1, name: 'Test Product 1', price: 100 };
const mockProduct2 = { id: 2, name: 'Test Product 2', price: 200 };

// A helper component to consume the context and expose its values for testing
const TestConsumerComponent = ({ onRender }) => {
  const cartContextValue = useCart();
  // Call a passed-in function with the context value so tests can access it
  if (typeof onRender === 'function') { // Check if onRender is a function
    onRender(cartContextValue);
  }
  return null; // This component doesn't need to render anything itself for these tests
};

describe('CartContext', () => {
  let capturedContextValue; // To capture the context value from the consumer
  let originalConsoleLog;   // To store original console.log
  let originalConsoleError; // To store original console.error

  // Helper to render the provider with the consumer
  const renderWithProvider = () => {
    return render(
      <CartProvider>
        <TestConsumerComponent onRender={(value) => { capturedContextValue = value; }} />
      </CartProvider>
    );
  };

  beforeEach(() => {
    // Reset captured value before each test
    capturedContextValue = null;

    // Store original console methods and mock them
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    console.log = jest.fn(); // jest.fn() creates a mock function
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore original console methods after each test
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    jest.restoreAllMocks(); // Good practice to restore all mocks
  });

  it('should initialize with an empty cart', () => {
    renderWithProvider();
    expect(capturedContextValue.cartItems).toEqual([]);
  });

  it('should add a new item to the cart', () => {
    renderWithProvider();
    act(() => {
      capturedContextValue.addToCart(mockProduct1);
    });
    expect(capturedContextValue.cartItems.length).toBe(1);
    expect(capturedContextValue.cartItems[0]).toEqual({ ...mockProduct1, quantity: 1 });
  });

  it('should increase quantity if the same item is added again', () => {
    renderWithProvider();
    act(() => {
      capturedContextValue.addToCart(mockProduct1); // First add
    });
    act(() => {
      capturedContextValue.addToCart(mockProduct1); // Second add
    });
    expect(capturedContextValue.cartItems.length).toBe(1);
    expect(capturedContextValue.cartItems[0].quantity).toBe(2);
  });

  it('should add a different item to the cart', () => {
    renderWithProvider();
    act(() => {
      capturedContextValue.addToCart(mockProduct1);
    });
    act(() => {
      capturedContextValue.addToCart(mockProduct2);
    });
    expect(capturedContextValue.cartItems.length).toBe(2);
    expect(capturedContextValue.cartItems.find(item => item.id === mockProduct1.id)).toBeDefined();
    expect(capturedContextValue.cartItems.find(item => item.id === mockProduct2.id)).toBeDefined();
  });

  it('should remove an item from the cart', () => {
    renderWithProvider();
    act(() => {
      capturedContextValue.addToCart(mockProduct1);
      capturedContextValue.addToCart(mockProduct2);
    });
    act(() => {
      capturedContextValue.removeFromCart(mockProduct1.id);
    });
    expect(capturedContextValue.cartItems.length).toBe(1);
    expect(capturedContextValue.cartItems[0].id).toBe(mockProduct2.id);
  });

  it('should update the quantity of an item', () => {
    renderWithProvider();
    act(() => {
      capturedContextValue.addToCart(mockProduct1);
    });
    act(() => {
      capturedContextValue.updateQuantity(mockProduct1.id, 5);
    });
    expect(capturedContextValue.cartItems[0].quantity).toBe(5);
  });

  it('should not allow quantity to be less than 1 when updating (defaults to 1)', () => {
    renderWithProvider();
    act(() => {
      capturedContextValue.addToCart(mockProduct1);
    });
    act(() => {
      capturedContextValue.updateQuantity(mockProduct1.id, 0); // Attempt to set to 0
    });
    // Based on our CartContext logic, it should default to 1
    expect(capturedContextValue.cartItems[0].quantity).toBe(1);
  });

  it('should clear the cart', () => {
    renderWithProvider();
    act(() => {
      capturedContextValue.addToCart(mockProduct1);
      capturedContextValue.addToCart(mockProduct2);
    });
    expect(capturedContextValue.cartItems.length).toBe(2); // Verify items are there
    act(() => {
      capturedContextValue.clearCart();
    });
    expect(capturedContextValue.cartItems.length).toBe(0);
  });
});