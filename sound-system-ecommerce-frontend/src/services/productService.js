// src/services/productService.js

const PRODUCTS_STORAGE_KEY = 'minervaProAudioProducts';

// Initial Mock data - only used if localStorage is empty
const initialMockProducts = [
  { id: 1, name: 'High-End Bookshelf Speakers', category: 'Speakers', price: 499.99, image: 'https://via.placeholder.com/300x200/FFD700/000000?Text=Speakers+1', description: 'Experience crystal clear sound with these premium bookshelf speakers, perfect for any audiophile.' },
  { id: 2, name: 'Studio Quality Headphones', category: 'Headphones', price: 199.50, image: 'https://via.placeholder.com/300x200/ADFF2F/000000?Text=Headphones+2', description: 'Immerse yourself in music with these comfortable, high-fidelity studio headphones.' },
  { id: 3, name: 'Portable Bluetooth Speaker', category: 'Speakers', price: 79.00, image: 'https://via.placeholder.com/300x200/87CEFA/000000?Text=Portable+3', description: 'Take your tunes on the go with this compact and powerful portable Bluetooth speaker.' },
  { id: 4, name: 'Home Theater Amplifier', category: 'Amplifiers', price: 799.00, description: 'Power your entire home theater system with this versatile and robust amplifier.' },
  { id: 5, name: 'Premium Noise-Cancelling Earbuds', category: 'Earbuds', price: 249.99, image: 'https://via.placeholder.com/300x200/E0FFFF/000000?Text=Earbuds+5', description: 'Enjoy pure sound without distractions thanks to advanced noise-cancelling technology.'},
];

// Helper function to get products from localStorage
const getStoredProducts = () => {
  const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (storedProducts) {
    try {
      return JSON.parse(storedProducts);
    } catch (e) {
      console.error("Error parsing stored products:", e);
      // If parsing fails, reset to initial data
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialMockProducts));
      return initialMockProducts;
    }
  } else {
    // If no products in storage, initialize with mock data
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialMockProducts));
    return initialMockProducts;
  }
};

// Helper function to save products to localStorage
const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Error saving products to storage:", e);
  }
};

// Initialize products when the service module is first loaded
let currentProducts = getStoredProducts();

// Simulate API delay (can be kept or reduced/removed for localStorage operations)
const simulateDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)); // Reduced delay

export const productService = {
  getAllProducts: async () => {
    await simulateDelay();
    currentProducts = getStoredProducts(); // Ensure we have the latest from storage
    console.log('[ProductService-LS] Fetching all products from localStorage');
    return Promise.resolve({ data: [...currentProducts] }); 
  },

  getProductById: async (id) => {
    await simulateDelay();
    currentProducts = getStoredProducts();
    const numericId = parseInt(id, 10);
    const product = currentProducts.find(p => p.id === numericId);
    console.log(`[ProductService-LS] Fetching product by ID: ${id} from localStorage`, product);
    if (product) {
      return Promise.resolve({ data: {...product} });
    } else {
      const error = new Error('Product not found');
      // error.response = { status: 404, data: { message: 'Product not found' } }; // Less relevant for LS
      return Promise.reject(error);
    }
  },

  createProduct: async (productData) => {
    await simulateDelay();
    currentProducts = getStoredProducts();
    const newProduct = {
      ...productData,
      id: Date.now(), 
      price: parseFloat(productData.price) || 0,
    };
    currentProducts.push(newProduct);
    saveStoredProducts(currentProducts);
    console.log('[ProductService-LS] Creating product in localStorage:', newProduct);
    return Promise.resolve({ data: {...newProduct} }); 
  },

  updateProduct: async (id, updatedData) => {
    await simulateDelay();
    currentProducts = getStoredProducts();
    const numericId = parseInt(id, 10);
    let productIndex = currentProducts.findIndex(p => p.id === numericId);
    if (productIndex !== -1) {
      currentProducts[productIndex] = { 
        ...currentProducts[productIndex], 
        ...updatedData,
        price: parseFloat(updatedData.price) || currentProducts[productIndex].price,
      };
      saveStoredProducts(currentProducts);
      console.log('[ProductService-LS] Updating product in localStorage:', currentProducts[productIndex]);
      return Promise.resolve({ data: {...currentProducts[productIndex]} });
    } else {
      const error = new Error('Product not found for update');
      return Promise.reject(error);
    }
  },

  deleteProduct: async (id) => {
    await simulateDelay();
    currentProducts = getStoredProducts();
    const numericId = parseInt(id, 10);
    const initialLength = currentProducts.length;
    currentProducts = currentProducts.filter(p => p.id !== numericId);
    saveStoredProducts(currentProducts);
    console.log(`[ProductService-LS] Deleting product ID: ${id} from localStorage`);
    if (currentProducts.length < initialLength) {
      return Promise.resolve({ data: { message: 'Product deleted successfully' } });
    } else {
      const error = new Error('Product not found for deletion');
      return Promise.reject(error);
    }
  },
};