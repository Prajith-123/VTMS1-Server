const express = require('express');
const { addVisitor, updateVisitor, getVisitors, searchVisitors, checkoutVisitor, deleteVisitor } = require('../controllers/visitorController');
const { upload } = require('../middleware/fileUploadMiddleware');

const router = express.Router();

router.post('/add-visitor', upload.single('photo'), addVisitor);
router.put('/:visitorId/photo', upload.single('photo'), updateVisitor);
router.put('/:visitorId', updateVisitor);
router.get('/', getVisitors);
router.get('/search', searchVisitors);
router.put('/:visitorId/checkout', checkoutVisitor);
router.delete('/:visitorId', deleteVisitor);

module.exports = router;