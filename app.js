// File: app.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Sample product data
const products = [
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    price: 89.99, 
    image: 'headphones.jpg',
    description: 'Premium wireless headphones with noise cancellation and 20-hour battery life.',
    specs: {
      color: 'Black',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '20 hours'
    }
  },
  { 
    id: 2, 
    name: 'Smart Watch', 
    price: 199.99, 
    image: 'smartwatch.jpg',
    description: 'Fitness tracker with heart rate monitoring and sleep analysis.',
    specs: {
      color: 'Silver',
      display: 'AMOLED',
      waterResistant: true
    }
  },
  { 
    id: 3, 
    name: 'Portable Power Bank', 
    price: 49.99, 
    image: 'powerbank.jpg',
    description: '20000mAh high-capacity power bank with fast charging capability.',
    specs: {
      capacity: '20000mAh',
      ports: 'USB-C, 2x USB-A',
      fastCharging: true
    }
  },
  { 
    id: 4, 
    name: 'Wireless Mouse', 
    price: 29.99, 
    image: 'mouse.jpg',
    description: 'Ergonomic wireless mouse with adjustable DPI settings.',
    specs: {
      color: 'Grey',
      connectivity: '2.4GHz wireless',
      buttons: 6
    }
  },
  { 
    id: 5, 
    name: 'Bluetooth Speaker', 
    price: 79.99, 
    image: 'speaker.jpg',
    description: 'Portable Bluetooth speaker with 360° sound and IPX7 waterproof rating.',
    specs: {
      color: 'Blue',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '12 hours'
    }
  }
];

// API endpoint for getting all products (with limited info)
app.get('/api/products', (req, res) => {
  // Return only the necessary information for the product list
  const productsList = products.map(({ id, name, price, image }) => ({ 
    id, name, price, image 
  }));
  
  res.json(productsList);
});

// API endpoint for getting a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
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
