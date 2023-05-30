const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { MONGO_URI } = require('./config/config');

const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const reportRoutes = require('./routes/reportRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const Visitor = require('./models/Visitor');

const app = express();

app.use(express.static('public'));
app.get('/favicon.ico', (req, res) => res.status(204));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/statistics', statisticsRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Hello, this is the root route!');
});

app.get('/api/search', async (req, res) => {
  const { q } = req.query;

  try {
    // Perform search logic based on the provided query parameter
    const searchResults = await Visitor.find({
      $or: [{ name: { $regex: q, $options: 'i' } }, { phone: { $regex: q, $options: 'i' } }],
    });

    // Send back the search results as a response
    res.json({ results: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Database connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });