require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const accountRoutes = require('./routes/accountRoutes');
const { getConnection } = require('./salesforce/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
// app.use(cors());
// app.options('*', cors());


// Middleware
 // Use the cors middleware with options
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/accounts', accountRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Initialize Salesforce connection and start server
async function startServer() {
  try {
    await getConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
     
    });
  } catch (error) {
    console.error('Failed to initialize Salesforce connection:', error);
    process.exit(1);
  }
}

startServer();