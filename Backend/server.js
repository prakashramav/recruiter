const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


