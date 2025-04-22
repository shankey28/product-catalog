// File: app.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const CLOUDFRONT_URL = 'https://dxxxxx.cloudfront.net';

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const tenantProducts = {
  cust1: [
    { 
      id: 1, 
      name: 'Premium Headphones', 
      price: 299.99,
      image: `${CLOUDFRONT_URL}/images/premium_headphones.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/luxury_smartwatch.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/pro_laptop.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/premium_camera.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/designer_tablet.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/basic_headphones.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/economy_smartwatch.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/budget_laptop.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/basic_camera.jpg`,
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
      image: `${CLOUDFRONT_URL}/images/student_tablet.jpg`,
      description: 'Affordable tablet perfect for students and casual users.',
      specs: {
        display: '10.2-inch LCD',
        storage: '64GB',
        pencilSupport: false
      }
    }
  ]
};

// Extract tenant from URL
app.use((req, res, next) => {
  const tenantMatch = req.path.match(/^\/([^/]+)\/api/);
  req.tenant = tenantMatch ? tenantMatch[1] : null;
  next();
});

// Modify API endpoints to be tenant-aware
app.get('/:tenant/api/products', (req, res) => {
  const tenant = req.params.tenant;
  console.log(`Fetching products for tenant: ${tenant}`);
  
  const products = tenantProducts[tenant] || [];
  console.log(`Found ${products.length} products for tenant ${tenant}`);
  
  const productsList = products.map(({ id, name, price, image }) => ({ 
    id, name, price, image 
  }));
  res.json(productsList);
});

app.get('/:tenant/api/products/:id', (req, res) => {
  const tenant = req.params.tenant;
  const id = parseInt(req.params.id);
  const product = (tenantProducts[tenant] || []).find(p => p.id === id);
  
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
