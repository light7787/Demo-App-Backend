require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const accountRoutes = require('./routes/accountRoutes');
const authRoutes = require('./mongo/routes');
const { getConnection } = require('./salesforce/connection');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Initialize Salesforce and MongoDB connections, then start server
async function startServer() {
  try {
    await getConnection(); // Connect to Salesforce (optional)

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_demo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Register routes after MongoDB is connected
    app.use('/api/contacts', contactRoutes);
    app.use('/api/accounts', accountRoutes);
    app.use('/api/auth', authRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
