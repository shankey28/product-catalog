// File: app.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

const tenantProducts = {
  cust1: [
    { 
      id: 1, 
      name: 'Premium Headphones', 
      price: 299.99,
      image: 'premium_headphones.jpg',
      description: 'High-end headphones with superior sound quality and noise cancellation.',
      specs: {
        color: 'Black',
        connectivity: 'Bluetooth 5.2',
        batteryLife: '30 hours'
      }
    },
    { 
      id: 2, 
      name: 'Luxury Smart Watch', 
      price: 499.99,
      image: 'luxury_smartwatch.jpg',
      description: 'Luxury smartwatch with advanced health tracking and premium materials.',
      specs: {
        color: 'Gold',
        display: 'AMOLED',
        waterResistant: true
      }
    },
    { 
      id: 3, 
      name: 'Pro Laptop', 
      price: 1999.99,
      image: 'pro_laptop.jpg',
      description: 'Professional-grade laptop with high-performance specs.',
      specs: {
        processor: 'Intel i9',
        ram: '32GB',
        storage: '1TB SSD'
      }
    },
    { 
      id: 4, 
      name: 'Premium Camera', 
      price: 899.99,
      image: 'premium_camera.jpg',
      description: 'Professional mirrorless camera with 4K video.',
      specs: {
        sensor: 'Full Frame',
        resolution: '45MP',
        videoCapability: '4K 60fps'
      }
    },
    { 
      id: 5, 
      name: 'Designer Tablet', 
      price: 799.99,
      image: 'designer_tablet.jpg',
      description: 'High-end tablet with stylus support for creative professionals.',
      specs: {
        display: '12.9-inch Retina',
        storage: '512GB',
        pencilSupport: true
      }
    }
  ],
  cust2: [
    { 
      id: 1, 
      name: 'Basic Headphones', 
      price: 89.99,
      image: 'basic_headphones.jpg',
      description: 'Affordable headphones with decent sound quality.',
      specs: {
        color: 'White',
        connectivity: 'Wired',
        batteryLife: 'N/A'
      }
    },
    { 
      id: 2, 
      name: 'Economy Smart Watch', 
      price: 99.99,
      image: 'economy_smartwatch.jpg',
      description: 'Budget-friendly smartwatch with essential features.',
      specs: {
        color: 'Black',
        display: 'LCD',
        waterResistant: false
      }
    },
    { 
      id: 3, 
      name: 'Budget Laptop', 
      price: 599.99,
      image: 'budget_laptop.jpg',
      description: 'Affordable laptop for everyday computing needs.',
      specs: {
        processor: 'Intel i3',
        ram: '8GB',
        storage: '256GB SSD'
      }
    },
    { 
      id: 4, 
      name: 'Basic Camera', 
      price: 299.99,
      image: 'basic_camera.jpg',
      description: 'Entry-level digital camera for hobbyists.',
      specs: {
        sensor: 'APS-C',
        resolution: '24MP',
        videoCapability: '1080p'
      }
    },
    { 
      id: 5, 
      name: 'Student Tablet', 
      price: 299.99,
      image: 'student_tablet.jpg',
      description: 'Affordable tablet perfect for students and casual users.',
      specs: {
        display: '10.2-inch LCD',
        storage: '64GB',
        pencilSupport: false
      }
    }
  ]
};

// Get tenant ID from environment variable
const tenantId = process.env.TENANT_ID || 'cust1';

// Modify products endpoint to use tenant-specific data
app.get('/api/products', (req, res) => {
  const products = tenantProducts[tenantId] || [];
  const productsList = products.map(({ id, name, price, image }) => ({ 
    id, name, price, image 
  }));
  res.json(productsList);
});

// API endpoint for getting a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = (tenantProducts[tenantId] || []).find(p => p.id === id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
