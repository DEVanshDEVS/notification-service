// src/services/inAppService.js

const Notification = require('../models/Notification');

/**
 * Send an in-app notification by saving it in the database.
 * @param {String} userId - The recipient user's ID.
 * @param {String} message - The notification message.
 * @returns {Promise<Boolean>}
 */
exports.sendInApp = async (userId, message) => {
  try {
    await Notification.create({
      userId,
      type: 'in-app',
      message,
      status: 'sent',
    });
    return true;
  } catch (error) {
    console.error('In-App notification error:', error);
    return false;
  }
};
