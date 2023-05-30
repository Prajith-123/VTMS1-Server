const express = require('express');
const { getVisitorStatistics } = require('../controllers/statisticsController');

const router = express.Router();

router.get('/', getVisitorStatistics);

module.exports = router;