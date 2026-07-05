const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/student', require('./routes/student.routes'));
app.use('/api/allocation', require('./routes/allocation.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

module.exports = app;