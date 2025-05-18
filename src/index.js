// src/index.js
require('dotenv').config(); // <--- VERY FIRST LINE

const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notification_service';

app.use(express.json());

// Use the notification routes with /notifications prefix
app.use('/notifications', notificationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Notification Service is running 🚀');
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
