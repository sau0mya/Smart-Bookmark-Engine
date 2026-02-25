const express = require('express');
const { protect } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

router.use(protect);

// @desc    Get activity logs
// @route   GET /api/activity
// @access  Private
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const logs = await ActivityLog.find({ userId: req.user.id })
        .populate('bookmarkId', 'title url')
        .sort('-timestamp')
        .skip(startIndex)
        .limit(limit);

    const total = await ActivityLog.countDocuments({ userId: req.user.id });

    res.status(200).json({
        success: true,
        count: logs.length,
        pagination: {
            page,
            limit,
            total
        },
        data: logs
    });
});

module.exports = router;
