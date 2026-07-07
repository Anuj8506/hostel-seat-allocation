const Student = require('../models/Student');
const Room = require('../models/Room');
const Preference = require('../models/Preference');
const Allocation = require('../models/Allocation');
const galeShapley = require('../algorithms/galeShapley');
const { YEAR_GROUPS } = require('../config/constants');
const { rankStudents } = require('../services/preferenceScoring');

const runRound1 = async (req, res) => {
  try {

    const existingAllocations = await Allocation.findOne({ round: 1 });
    if (existingAllocations) {
      return res.status(400).json({ message: 'Round 1 has already been run. Reset the system before running again.' });
    }
    // Step 1 - Fetch students split by pool
    const firstYearStudents = await Student.find({
      year: { $in: YEAR_GROUPS.FIRST_YEAR },
      isAllocated: false
    });
    const seniorStudents = await Student.find({
      year: { $in: YEAR_GROUPS.SENIOR },
      isAllocated: false
    });

    // Step 2 - Rank students by score before matching
    const rankedFirstYear = rankStudents(firstYearStudents);
    const rankedSenior = rankStudents(seniorStudents);

    // Step 3 - Fetch rooms split by category
    const firstYearRooms = await Room.find({ category: 'first-year' });
    const seniorRooms = await Room.find({ category: 'senior' });

    // Step 4 - Fetch round 1 preferences for each pool
    const firstYearPreferences = await Preference.find({
      student: { $in: rankedFirstYear.map(s => s._id) },
      round: 1
    });
    const seniorPreferences = await Preference.find({
      student: { $in: rankedSenior.map(s => s._id) },
      round: 1
    });

    // Step 5 - Shape data for galeShapley
    const shapeStudents = (students, preferences) => {
      return students.map(student => {
        const pref = preferences.find(
          p => p.student.toString() === student._id.toString()
        );
        return {
          id: student._id.toString(),
          preferences: pref ? pref.rankedHostels.map(h => h.toString()) : []
        };
      });
    };

    const shapeRooms = (rooms, rankedStudents) => {
      const preferenceOrder = rankedStudents.map(s => s._id.toString());
      return rooms.map(room => ({
        id: room._id.toString(),
        capacity: room.capacity,
        currentlyHeld: [],
        preferences: preferenceOrder
      }));
    };

    // Step 6 - Run algorithm separately for each pool
    const firstYearResult = galeShapley(
      shapeStudents(rankedFirstYear, firstYearPreferences),
      shapeRooms(firstYearRooms, rankedFirstYear)
    );
    const seniorResult = galeShapley(
      shapeStudents(rankedSenior, seniorPreferences),
      shapeRooms(seniorRooms, rankedSenior)
    );

    // Step 7 - Combine both pools results
    const combinedStudentMatch = {
      ...firstYearResult.studentMatch,
      ...seniorResult.studentMatch
    };
    const combinedUnmatched = [
      ...firstYearResult.unmatchedStudents,
      ...seniorResult.unmatchedStudents
    ];

    // Step 8 - Save allocations to DB
    const allocationDocs = [];
    for (const [studentId, roomId] of Object.entries(combinedStudentMatch)) {
      if (!roomId) continue; // skip unmatched students

      const preference = await Preference.findOne({ student: studentId, round: 1 });
      if (!preference) {
        console.error(`No preference found for student ${studentId}`);
        continue;
      }

      allocationDocs.push({
        student: studentId,
        room: roomId,
        preference: preference._id,
        round: 1,
        status: 'allocated'
      });

      await Room.findByIdAndUpdate(roomId, { $inc: { currentOccupancy: 1 } });
      await Student.findByIdAndUpdate(studentId, { isAllocated: true });
    }

    await Allocation.insertMany(allocationDocs);

    return res.status(200).json({
      message: 'Round 1 allocation complete',
      allocated: allocationDocs.length,
      unmatched: combinedUnmatched.length,
      unmatchedStudents: combinedUnmatched
    });

  } catch (error) {
    console.error('Error in runRound1:', error);
    return res.status(500).json({ message: error.message });
  }
};

const runRound2 = async (req, res) => {
  try {
    // Guard — prevent Round 2 from running twice
    const existingRound2 = await Allocation.findOne({ round: 2 });
    if (existingRound2) {
      return res.status(400).json({ message: 'Round 2 has already been run. Reset the system before running again.' });
    }
    // Step 1 - Fetch unmatched students split by pool
    const unmatchedFirstYear = await Student.find({
      year: { $in: YEAR_GROUPS.FIRST_YEAR },
      isAllocated: false
    });
    const unmatchedSenior = await Student.find({
      year: { $in: YEAR_GROUPS.SENIOR },
      isAllocated: false
    });

    if (unmatchedFirstYear.length === 0 && unmatchedSenior.length === 0) {
      return res.status(200).json({ message: 'No unmatched students remaining' });
    }

    // Step 2 - Rank unmatched students by score
    const rankedFirstYear = rankStudents(unmatchedFirstYear);
    const rankedSenior = rankStudents(unmatchedSenior);

    // Step 3 - Fetch remaining capacity rooms split by category
    const availableFirstYearRooms = await Room.find({
      category: 'first-year',
      $expr: { $lt: ['$currentOccupancy', '$capacity'] }
    });
    const availableSeniorRooms = await Room.find({
      category: 'senior',
      $expr: { $lt: ['$currentOccupancy', '$capacity'] }
    });

    // Step 4 - Fetch round 2 preferences for each pool
    const firstYearPreferences = await Preference.find({
      student: { $in: rankedFirstYear.map(s => s._id) },
      round: 2
    });
    const seniorPreferences = await Preference.find({
      student: { $in: rankedSenior.map(s => s._id) },
      round: 2
    });

    // Step 5 - Shape and run algorithm separately for each pool
    const firstYearResult = galeShapley(
      rankedFirstYear.map(student => {
        const pref = firstYearPreferences.find(
          p => p.student.toString() === student._id.toString()
        );
        return {
          id: student._id.toString(),
          preferences: pref ? pref.rankedHostels.map(h => h.toString()) : []
        };
      }),
      availableFirstYearRooms.map(room => ({
        id: room._id.toString(),
        capacity: room.capacity,
        currentlyHeld: [],
        preferences: rankedFirstYear.map(s => s._id.toString())
      }))
    );

    const seniorResult = galeShapley(
      rankedSenior.map(student => {
        const pref = seniorPreferences.find(
          p => p.student.toString() === student._id.toString()
        );
        return {
          id: student._id.toString(),
          preferences: pref ? pref.rankedHostels.map(h => h.toString()) : []
        };
      }),
      availableSeniorRooms.map(room => ({
        id: room._id.toString(),
        capacity: room.capacity,
        currentlyHeld: [],
        preferences: rankedSenior.map(s => s._id.toString())
      }))
    );

    // Step 6 - Combine both pools results
    const studentMatch = {
      ...firstYearResult.studentMatch,
      ...seniorResult.studentMatch
    };
    const stillUnmatched = [
      ...firstYearResult.unmatchedStudents,
      ...seniorResult.unmatchedStudents
    ];

    // Step 7 - Save round 2 allocations to DB
    const allocationDocs = [];
    for (const [studentId, roomId] of Object.entries(studentMatch)) {
      if (!roomId) continue; // skip unmatched students
      const preference = await Preference.findOne({ student: studentId, round: 2 });
      if (!preference) {
        console.error(`No preference found for student ${studentId}`);
        continue;
      }

      allocationDocs.push({
        student: studentId,
        room: roomId,
        preference: preference._id,
        round: 2,
        status: 'allocated'
      });

      await Room.findByIdAndUpdate(roomId, { $inc: { currentOccupancy: 1 } });
      await Student.findByIdAndUpdate(studentId, { isAllocated: true });
    }

    if (allocationDocs.length > 0) {
      await Allocation.insertMany(allocationDocs);
    }

    return res.status(200).json({
      message: 'Round 2 allocation complete',
      allocated: allocationDocs.length,
      unmatched: stillUnmatched.length,
      unmatchedStudents: stillUnmatched
    });

    } catch (error) {
      console.error('Error in runRound2:', error);
      return res.status(500).json({ message: error.message });
    }
};

const getAllResults = async (req, res) => {
  try {
    const allocations = await Allocation.find({ status: 'allocated' })
      .populate('student', '-password')
      .populate('room');

    return res.status(200).json({ allocations });

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

module.exports = { runRound1, runRound2, getAllResults, getUnmatchedStudents };