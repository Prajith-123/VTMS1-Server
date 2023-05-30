const Visitor = require('../models/Visitor');

const getVisitorStatistics = async (req, res) => {
  try {
    const today = await Visitor.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    const yesterday = await Visitor.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)).setDate(
          new Date().getDate() - 1
        ),
        $lt: new Date().setHours(0, 0, 0, 0),
      },
    });

    const last7Days = await Visitor.countDocuments({
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
    });

    const total = await Visitor.countDocuments();

    res.json({ today, yesterday, last7Days, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getVisitorStatistics };