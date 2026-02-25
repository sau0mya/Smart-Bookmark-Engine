const express = require('express');
const { getAnalytics, getInsights } = require('../controllers/analytics');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAnalytics);
router.get('/insights', getInsights);

module.exports = router;
