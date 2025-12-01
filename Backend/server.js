const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const applicantRoutes = require("./routes/applicantRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const atsRoutes = require("./routes/atsRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

app.get("/", (req, res) => {
  res.send("Recruitment Backend Running Successfully");
});

// Use Routes
app.use("/api/admins", adminRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/interviews", interviewRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
