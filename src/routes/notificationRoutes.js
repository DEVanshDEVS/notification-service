// src/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Send a notification (email, sms, in-app)
router.post('/notifications', notificationController.sendNotification);

// Get all notifications for a user (optionally filtered by type)
router.get('/notifications/users/:id/notifications', notificationController.getUserNotifications);

// Mark an in-app notification as read
router.patch('/notifications/:notificationId/read', notificationController.markAsRead);

module.exports = router;
