const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8000;

const applicantRoutes = require('./routes/applicantRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recruiterRoutes = require('./routes/recruterRoutes');
const atsRouter = require('./routes/atsRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const app = express();


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.use('/api/applicants', applicantRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/ats', atsRouter);
app.use('/api/interviews', interviewRoutes);

app.get('/', (req, res) => {
  res.send('Recruitment Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


