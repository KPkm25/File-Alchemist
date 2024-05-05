const express = require('express');
const util = require('util');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const uploads = require('./routes/api/upload');
const exportFile = require('./routes/api/export');
const converts = require('./routes/api/convert');


dotenv.config();

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB',process.env.MONGO_URI);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.send('hello');
});


app.use("/api/upload", uploads);
app.use("/api/export", exportFile);
app.use("/api/convert", converts);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
