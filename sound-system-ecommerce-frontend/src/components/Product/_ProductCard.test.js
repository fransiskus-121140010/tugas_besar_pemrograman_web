// src/components/Product/ProductCard.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // ProductCard uses <Link>
import ProductCard from './ProductCard';

// Mock product data for testing
const mockProduct = {
  id: 1,
  name: 'Awesome Sound System',
  category: 'Speakers',
  price: 299.99,
  image: 'https://via.placeholder.com/300x200.png?text=Awesome+System',
  description: 'A truly awesome sound system for your home.',
};

const mockProductNoImage = {
  id: 2,
  name: 'Budget Sound Bar',
  category: 'Soundbars',
  price: 99.00,
  description: 'Good sound on a budget.',
  // No image property
};

// Helper function to render ProductCard within Router because it contains <Link>
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: Router });
};

describe('ProductCard Component', () => {
  it('renders product details correctly when all props are provided', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    // Check for product name
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();

    // Check for product category
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();

    // Check for product price (formatted)
    // Price is $299.99, so we check for that string.
    // Using a regex for flexibility with currency symbol if it changes
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();

    // Check for the image
    const imageElement = screen.getByAltText(mockProduct.name);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockProduct.image);

    // Check for the "View Details" button/link
    const viewDetailsLink = screen.getByRole('link', { name: /view details/i });
    expect(viewDetailsLink).toBeInTheDocument();
    expect(viewDetailsLink).toHaveAttribute('href', `/products/${mockProduct.id}`);
  });

  it('renders placeholder image if product image is not provided', () => {
    renderWithRouter(<ProductCard product={mockProductNoImage} />);

    const imageElement = screen.getByAltText(mockProductNoImage.name);
    expect(imageElement).toBeInTheDocument();
    // The placeholder image URL is defined inside ProductCard.js
    // We can check if the src is not empty or matches a known pattern if necessary,
    // but for now, ensuring it's there and has alt text is good.
    // A more robust test might involve checking against the exact placeholder URL if it's exported or constant.
    // For this example, we assume the placeholder logic within ProductCard works.
    // The placeholder URL used in ProductCard.js is 'https://via.placeholder.com/300x200.png?text=Sound+System'
    expect(imageElement).toHaveAttribute('src', 'https://via.placeholder.com/300x200.png?text=Sound+System');
  });

  it('renders N/A for price if price is not provided or zero (based on current ProductCard logic)', () => {
    const productWithoutPrice = { ...mockProduct, price: undefined };
    renderWithRouter(<ProductCard product={productWithoutPrice} />);
    // Your ProductCard currently has: product.price ? product.price.toFixed(2) : 'N/A'
    expect(screen.getByText('$N/A')).toBeInTheDocument();

    const productWithZeroPrice = { ...mockProduct, price: 0 };
    renderWithRouter(<ProductCard product={productWithZeroPrice} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument(); // 0.toFixed(2) is "0.00"
  });

  it('renders category or default if not provided', () => {
    const productWithoutCategory = { ...mockProduct, category: undefined };
    renderWithRouter(<ProductCard product={productWithoutCategory} />);
    // Your ProductCard currently has: product.category || 'Sound System'
    expect(screen.getByText('Sound System')).toBeInTheDocument();
  });
});