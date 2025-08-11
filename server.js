const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(bodyParser.json());

// Dummy user data for login
const users = [
  { username: 'user', password: 'pass123' }
];

// Dummy products data
const products = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
  { id: 3, name: 'Product 3', price: 30 }
];

// In-memory cart storage (demo only)
let userCarts = {};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Products endpoint
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Add to Cart API
app.post('/api/cart/add', (req, res) => {
  const { username, productId } = req.body;

  if (!username || !productId) {
    return res.status(400).json({ success: false, message: 'Missing username or productId' });
  }

  if (!userCarts[username]) {
    userCarts[username] = {};  // use object instead of array
  }

  if (!userCarts[username][productId]) {
    userCarts[username][productId] = 0;
  }

  userCarts[username][productId]++;

  console.log(`User ${username} added product ${productId} to cart.`);

  console.log('Current cart:');
  for (const [id, qty] of Object.entries(userCarts[username])) {
    console.log(`Product ${id} quantity: ${qty}`);
  }

  res.json({ success: true, message: 'Product added to cart', cart: userCarts[username] });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
