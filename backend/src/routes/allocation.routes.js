const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocation.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/run/round1', protect, adminOnly, allocationController.runRound1);
router.post('/run/round2', protect, adminOnly, allocationController.runRound2);
router.get('/results', protect, adminOnly, allocationController.getAllResults);
router.get('/unmatched', protect, adminOnly, allocationController.getUnmatchedStudents);

module.exports = router;