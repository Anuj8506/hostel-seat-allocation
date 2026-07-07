const Student = require('../models/Student');
const Room = require('../models/Room');
const Preference = require('../models/Preference');
const Allocation = require('../models/Allocation');

const submitPreferences = async (req, res) => {
  try {
    const { rankedHostels } = req.body;
    const studentId = req.user._id;

    // Check if student already submitted preferences for round 1
    const existingPreference = await Preference.findOne({
      student: studentId,
      round: 1
    });
    if (existingPreference) {
      return res.status(400).json({ message: 'Preferences already submitted for round 1' });
    }

    // Validate rankedHostels is a non-empty array
    if (!rankedHostels || !Array.isArray(rankedHostels) || rankedHostels.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one hostel preference' });
    }

    // Validate all hostel IDs exist and match student category
    const category = req.user.year === 1 ? 'first-year' : 'senior';
    const validRooms = await Room.find({
      _id: { $in: rankedHostels },
      category
    });
    if (validRooms.length !== rankedHostels.length) {
      return res.status(400).json({ message: 'One or more invalid hostel selections' });
    }

    // Create preference document
    const preference = await Preference.create({
      student: studentId,
      rankedHostels,
      round: 1
    });

    return res.status(201).json({
      message: 'Preferences submitted successfully',
      preference
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const submitRound2Preferences = async (req, res) => {
  try {
    const { rankedHostels } = req.body;
    const studentId = req.user._id;

    // Must be unmatched after round 1 to submit round 2
    const allocation = await Allocation.findOne({ student: studentId });
    if (allocation) {
      return res.status(400).json({ message: 'You already have an allocation' });
    }

    // Check round 1 preference exists
    const round1Preference = await Preference.findOne({
      student: studentId,
      round: 1
    });
    if (!round1Preference) {
      return res.status(400).json({ message: 'No round 1 preference found' });
    }

    // Check round 2 preference not already submitted
    const existingRound2 = await Preference.findOne({
      student: studentId,
      round: 2
    });
    if (existingRound2) {
      return res.status(400).json({ message: 'Round 2 preferences already submitted' });
    }

    // Validate hostels exist and have remaining capacity
    if (!rankedHostels || !Array.isArray(rankedHostels) || rankedHostels.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one hostel preference' });
    }

    const category = req.user.year === 1 ? 'first-year' : 'senior';
    const validRooms = await Room.find({
      _id: { $in: rankedHostels },
      category,
      $expr: { $lt: ['$currentOccupancy', '$capacity'] }
    });
    if (validRooms.length !== rankedHostels.length) {
      return res.status(400).json({ message: 'One or more hostels are full or invalid' });
    }

    const preference = await Preference.create({
      student: studentId,
      rankedHostels,
      round: 2
    });

    return res.status(201).json({
      message: 'Round 2 preferences submitted successfully',
      preference
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const viewAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findOne({
      student: req.user._id,
      status: 'allocated'
    }).populate('room');

    const round2Preference = await Preference.findOne({
      student: req.user._id,
      round: 2
    });

    return res.status(200).json({
      allocation: allocation || null,
      hasSubmittedRound2: !!round2Preference
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAvailableHostels = async (req, res) => {
  try {
    const category = req.user.year === 1 ? 'first-year' : 'senior';

    const availableRooms = await Room.find({
      category,
      $expr: { $lt: ['$currentOccupancy', '$capacity'] }
    });

    return res.status(200).json({ availableRooms });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitPreferences,
  submitRound2Preferences,
  viewAllocation,
  getAvailableHostels
};