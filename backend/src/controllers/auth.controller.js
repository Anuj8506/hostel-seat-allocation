const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Allocation = require('../models/Allocation');
const Preference = require('../models/Preference');
const { VALID_BRANCHES } = require('../config/constants');

const register = async (req, res) => {
  try {
    const { name, email, password, year, branch, twelfthPercentage, cgpa } = req.body;

    // Check all required fields
    if (!name || !email || !password || !year || !branch) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate branch against college branch list
    if (!VALID_BRANCHES.includes(branch.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid branch' });
    }

    // Validate scoring field based on year
    if (year === 1 && !twelfthPercentage) {
      return res.status(400).json({ message: 'First year students must provide 12th percentage' });
    }
    if (year !== 1 && !cgpa) {
      return res.status(400).json({ message: 'Senior students must provide CGPA' });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      year,
      branch: branch.toUpperCase(),
      twelfthPercentage: year === 1 ? twelfthPercentage : undefined,
      cgpa: year !== 1 ? cgpa : undefined
    });

    // Generate token
    const token = jwt.sign(
      { id: student._id, isAdmin: student.isAdmin, name: student.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      message: 'Registration successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        year: student.year,
        branch: student.branch,
        isAdmin: student.isAdmin
      }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find student and include password for comparison
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: student._id, isAdmin: student.isAdmin, name: student.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Check preference status to help frontend decide where to route the student
    const round1Preference = await Preference.findOne({ student: student._id, round: 1 });
    const round2Preference = await Preference.findOne({ student: student._id, round: 2 });
    
    const round1HasRun = await Allocation.findOne({ round: 1 });

    return res.status(200).json({
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        year: student.year,
        branch: student.branch,
        isAdmin: student.isAdmin,
        isAllocated: student.isAllocated,
        hasSubmittedRound1: !!round1Preference,
        hasSubmittedRound2: !!round2Preference,
        round1HasRun: !!round1HasRun   // new
      }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };