const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/rooms', protect, adminOnly, adminController.createRoom);
router.get('/rooms', protect, adminOnly, adminController.getAllRooms);
router.patch('/rooms/:id', protect, adminOnly, adminController.updateRoom);
router.delete('/rooms/:id', protect, adminOnly, adminController.deleteRoom);
router.get('/students', protect, adminOnly, adminController.getAllStudents);
router.get('/students/unmatched', protect, adminOnly, adminController.getUnmatchedStudents);

module.exports = router;