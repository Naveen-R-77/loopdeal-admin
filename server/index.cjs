require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User.cjs');
const Product = require('./models/Product.cjs');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loopdeal_admin_hub';

app.use(cors());
app.use(express.json());

// MongoDB Connection (Atlas or Local)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected successfully to MongoDB Database Chain');
    seedData();
  })
  .catch(err => console.error('Cloud DB Connectivity Link Error:', err));

// Seeding Mock Data if Database is Empty
async function seedData() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const mockProducts = [
      { name: "COFE 4G / 5G SIM Card Wi-Fi 6 Router", price: 1800, category: "Network", stock: 45, image: "https://loopdeal.in/wp-content/uploads/2020/10/COFE_ROUTER_U.jpg" },
      { name: "CP PLUS ezyKam+ Smart Wi-Fi Camera", price: 2499, category: "CCTV Cameras", stock: 120, image: "https://loopdeal.in/wp-content/uploads/2020/10/cp_E45A_1.jpg" },
      { name: "CP PLUS 2.4 MP Full HD IR Bullet Camera", price: 1599, category: "CCTV Cameras", stock: 200, image: "https://loopdeal.in/wp-content/uploads/2020/10/Bullet_2mp_BW_u-1.jpg" },
      { name: "CP PLUS 2.4 MP Full HD IR DOME Camera", price: 1499, category: "CCTV Cameras", stock: 30, image: "https://loopdeal.in/wp-content/uploads/2020/10/CP-PLUS-DOME-U.jpg" },
      { name: "CP PLUS 4-Channel DVR Special Edition", price: 3499, category: "NVR & DVR", stock: 18, image: "https://loopdeal.in/wp-content/uploads/2020/10/Product_Source_Image_temp.jpg" },
      { name: "CP PLUS 4G SIM Card Wi-Fi 6 Router", price: 2299, category: "Network", stock: 55, image: "https://loopdeal.in/wp-content/uploads/2020/10/COFE_ROUTER_U.jpg" },
      { name: "CP PLUS 8-Channel High Performance DVR", price: 4599, category: "NVR & DVR", stock: 80, image: "https://loopdeal.in/wp-content/uploads/2020/10/Product_Source_Image_temp.jpg" },
      { name: "DAHUA 4 Channel Smart NVR", price: 3700, category: "NVR & DVR", stock: 65, image: "https://loopdeal.in/wp-content/uploads/2020/10/DAHUA_NVR_U-1.jpg" },
      { name: "HIKVISION 4 Channel Professional NVR", price: 3800, category: "NVR & DVR", stock: 40, image: "https://loopdeal.in/wp-content/uploads/2020/10/HIKVISION_4c_NVR_U.jpg" },
      { name: "LENOVO THINKCENTRE M73 TINY PC", price: 14000, category: "Desktops", stock: 15, image: "https://loopdeal.in/wp-content/uploads/2024/12/PRODUCT_TEMPLATE_U-1.jpg" },
      { name: "MASTEL Wireless 4G High Speed Router", price: 2148, category: "Network", stock: 90, image: "https://loopdeal.in/wp-content/uploads/2020/10/MASTEL_U.jpg" },
      { name: "PRAMA 4-Channel Professional DVR", price: 2899, category: "NVR & DVR", stock: 110, image: "https://loopdeal.in/wp-content/uploads/2020/10/PRAMA_DVR.jpg" },
    ];
    await Product.insertMany(mockProducts);
    console.log('Mock products seeded to MongoDB');
  }

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const defaultAdmins = [
      { name: "Master Admin", email: "admin@store.com", password: "admin123" },
      { name: "Samukthaa", email: "samukthaa@gmail.com", password: "admin123" }
    ];
    await User.insertMany(defaultAdmins);
    console.log('Primary administrators seeded to MongoDB');
  }
}

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });
  
  const user = new User({ name, email, password });
  await user.save();
  res.json({ success: true, user: { name: user.name, email: user.email } });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
