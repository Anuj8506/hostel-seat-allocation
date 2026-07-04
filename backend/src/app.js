const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/student', require('./routes/student.routes'));
app.use('/api/allocation', require('./routes/allocation.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

module.exports = app;