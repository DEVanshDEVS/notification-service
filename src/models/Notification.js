// src/models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['email', 'sms', 'in-app'], 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['sent', 'failed', 'read', 'unread'], 
    default: function() {
      // For in-app notifications, default to 'unread'; otherwise, 'sent'
      return this.type === 'in-app' ? 'unread' : 'sent';
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Notification', notificationSchema);
