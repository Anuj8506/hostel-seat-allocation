const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/preferences', protect, studentController.submitPreferences);
router.get('/allocation', protect, studentController.viewAllocation);
router.post('/preferences/round2', protect, studentController.submitRound2Preferences);
router.get('/hostels/available', protect, studentController.getAvailableHostels);

module.exports = router;