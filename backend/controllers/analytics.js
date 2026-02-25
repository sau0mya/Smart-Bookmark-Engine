const ErrorResponse = require('../utils/errorResponse');
const Bookmark = require('../models/Bookmark');
const ActivityLog = require('../models/ActivityLog');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = asyncHandler(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Total Metrics
    const totalStats = await Bookmark.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: null,
                totalBookmarks: { $sum: 1 },
                favoritesCount: { $sum: { $cond: [{ $eq: ['$status', 'favorite'] }, 1, 0] } },
                archivedCount: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } }
            }
        }
    ]);

    // 2. Most Used Categories
    const categoryStats = await Bookmark.aggregate([
        { $match: { userId } },
        { $unwind: '$category' },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // 3. Top 5 Most Visited Bookmarks
    const topVisited = await Bookmark.find({ userId })
        .sort('-visitCount')
        .limit(5)
        .select('title url visitCount');

    // 4. Activity Count per Day (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityTrend = await ActivityLog.aggregate([
        {
            $match: {
                userId,
                timestamp: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 5. Bookmark Creation Trend (Monthly)
    const monthlyTrend = await Bookmark.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        success: true,
        data: {
            stats: totalStats[0] || { totalBookmarks: 0, favoritesCount: 0, archivedCount: 0 },
            categories: categoryStats,
            topVisited,
            activityTrend,
            monthlyTrend
        }
    });
});

// @desc    Get Smart Insights
// @route   GET /api/analytics/insights
// @access  Private
exports.getInsights = asyncHandler(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const insights = [];

    // Most frequent category insight
    const topCategory = await Bookmark.aggregate([
        { $match: { userId } },
        { $unwind: '$category' },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    if (topCategory.length > 0) {
        insights.push(`You save most bookmarks in the ${topCategory[0]._id} category.`);
    }

    // Unvisited bookmarks insight
    const total = await Bookmark.countDocuments({ userId });
    const zeroVisits = await Bookmark.countDocuments({ userId, visitCount: 0 });

    if (total > 0) {
        const percentage = Math.round((zeroVisits / total) * 100);
        if (percentage > 0) {
            insights.push(`You have not visited ${percentage}% of your bookmarks.`);
        }
    }

    // Peak activity day insight (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const peakDay = await ActivityLog.aggregate([
        { $match: { userId, timestamp: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dayOfWeek: '$timestamp' },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (peakDay.length > 0) {
        insights.push(`Your activity peaks on ${days[peakDay[0]._id - 1]}s.`);
    }

    // Favorites category insight
    const favCategory = await Bookmark.aggregate([
        { $match: { userId, status: 'favorite' } },
        { $unwind: '$category' },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    if (favCategory.length > 0) {
        insights.push(`You tend to favorite ${favCategory[0]._id} bookmarks.`);
    }

    res.status(200).json({
        success: true,
        data: insights
    });
});
