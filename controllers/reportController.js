const Visitor = require('../models/Visitor');

const generateReport = async (req, res) => {
  // Logic to generate report between two dates
  const { start, end } = req.query; // Retrieve start and end dates from query parameters

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const reports = await Visitor.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generateReport };