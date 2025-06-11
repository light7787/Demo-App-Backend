require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const accountRoutes = require('./routes/accountRoutes');
const authRoutes = require('./mongo/routes')
const { getConnection } = require('./salesforce/connection');

const mongoose = require("mongoose");

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


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});


// Initialize Salesforce connection and start server
async function startServer() {
  try {
    await getConnection();
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB')
     app.use('/api/contacts', contactRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/auth',authRoutes)
     
     )

.catch(err => console.error('MongoDB connection error:', err));
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
     
    });
  } catch (error) {
    console.error('Failed to initialize Salesforce connection:', error);
    process.exit(1);
  }
}

startServer();
