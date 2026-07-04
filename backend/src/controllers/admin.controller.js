const Student = require('../models/Student');
const Room = require('../models/Room');
const Allocation = require('../models/Allocation');
const { VALID_BRANCHES } = require('../config/constants');

const createRoom = async (req, res) => {
  try {
    const { hostelName, category, capacity } = req.body;

    if (!hostelName || !category || !capacity) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const room = await Room.create({
      hostelName,
      category,
      capacity,
      currentOccupancy: 0
    });

    return res.status(201).json({
      message: 'Room created successfully',
      room
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json({ rooms });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { hostelName, capacity } = req.body;

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { hostelName, capacity },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    return res.status(200).json({
      message: 'Room updated successfully',
      room
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    return res.status(200).json({ message: 'Room deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    return res.status(200).json({ students });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUnmatchedStudents = async (req, res) => {
  try {
    const unmatched = await Student.find({ isAllocated: false }).select('-password');
    return res.status(200).json({ unmatched });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
  getAllStudents,
  getUnmatchedStudents
};