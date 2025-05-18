// src/controllers/notificationController.js

const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');

// Dummy in-app sender (can be just a placeholder function)
const sendInApp = async (userId, message) => {
  // For in-app, you may just log or always return true, as the DB save is the notification itself
  return true;
};

// POST /notifications
exports.sendNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'userId, type, and message are required.' });
  }

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    let sent = false;

    // Send notification based on type
    if (type === 'email') {
      sent = await sendEmail(user.email, message);
    } else if (type === 'sms') {
      sent = await sendSMS(user.phone, message);
    } else if (type === 'in-app') {
      sent = await sendInApp(userId, message); // Always returns true
    } else {
      return res.status(400).json({ error: 'Invalid notification type.' });
    }

    // For in-app, default status is 'unread' (handled by model default)
    // For others, status is 'sent' or 'failed'
    const notification = await Notification.create({
      userId,
      type,
      message,
      status: sent ? undefined : 'failed', // Let model default handle 'unread' or 'sent'
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// GET /notifications/users/:id/notifications?type=in-app
exports.getUserNotifications = async (req, res) => {
  const userId = req.params.id;
  const { type } = req.query;
  try {
    const filter = { userId };
    if (type) filter.type = type;
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// PATCH /notifications/:notificationId/read
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ error: 'Notification not found.' });

    if (notification.type !== 'in-app') {
      return res.status(400).json({ error: 'Only in-app notifications can be marked as read.' });
    }

    notification.status = 'read';
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
