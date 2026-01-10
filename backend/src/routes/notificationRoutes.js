const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  subscribeToPush,
  unsubscribeFromPush,
  getVapidPublicKey
} = require('../controllers/notificationController');

// Public routes
router.get('/vapid-public-key', getVapidPublicKey);

// Protected routes
router.use(protect);
router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
router.post('/subscribe', subscribeToPush);
router.post('/unsubscribe', unsubscribeFromPush);

module.exports = router;
