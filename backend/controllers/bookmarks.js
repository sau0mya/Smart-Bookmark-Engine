const ErrorResponse = require('../utils/errorResponse');
const Bookmark = require('../models/Bookmark');
const ActivityLog = require('../models/ActivityLog');
const { scrapeUrl } = require('../utils/scraper');
const asyncHandler = require('../middleware/async');

// @desc    Get all bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Bookmark.find({ ...JSON.parse(queryStr), userId: req.user.id });

    // Search by title or description
    if (req.query.search) {
        query = query.find({
            $text: { $search: req.query.search }
        });
    }

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bookmarks = await query;

    res.status(200).json({
        success: true,
        count: bookmarks.length,
        pagination: {
            page,
            limit
        },
        data: bookmarks
    });
});

// @desc    Get single bookmark
// @route   GET /api/bookmarks/:id
// @access  Private
exports.getBookmark = asyncHandler(async (req, res, next) => {
    const bookmark = await Bookmark.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!bookmark) {
        return next(
            new ErrorResponse(`Bookmark not found with id of ${req.params.id}`, 404)
        );
    }

    // Log visit
    bookmark.visitCount += 1;
    await bookmark.save();

    await ActivityLog.create({
        userId: req.user.id,
        bookmarkId: bookmark._id,
        action: 'VISIT'
    });

    res.status(200).json({
        success: true,
        data: bookmark
    });
});

// @desc    Create new bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.createBookmark = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.userId = req.user.id;

    // Async scrape in background or wait? 
    // For now, let's wait to ensure we have the data for the response.
    const scapedData = await scrapeUrl(req.body.url);

    if (scapedData) {
        req.body.title = req.body.title || scapedData.title;
        req.body.description = req.body.description || scapedData.description;
        req.body.summary = scapedData.summary;
        req.body.content = scapedData.content;
    }

    const bookmark = await Bookmark.create(req.body);

    // Log activity
    await ActivityLog.create({
        userId: req.user.id,
        bookmarkId: bookmark._id,
        action: 'CREATE'
    });

    res.status(201).json({
        success: true,
        data: bookmark
    });
});

// @desc    Update bookmark
// @route   PUT /api/bookmarks/:id
// @access  Private
exports.updateBookmark = asyncHandler(async (req, res, next) => {
    let bookmark = await Bookmark.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!bookmark) {
        return next(
            new ErrorResponse(`Bookmark not found with id of ${req.params.id}`, 404)
        );
    }

    bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Log activity
    await ActivityLog.create({
        userId: req.user.id,
        bookmarkId: bookmark._id,
        action: 'UPDATE'
    });

    res.status(200).json({
        success: true,
        data: bookmark
    });
});

// @desc    Get bookmark content for Reading Mode
// @route   GET /api/bookmarks/:id/read
// @access  Private
exports.getBookmarkRead = asyncHandler(async (req, res, next) => {
    let bookmark = await Bookmark.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!bookmark) {
        return next(
            new ErrorResponse(`Bookmark not found with id of ${req.params.id}`, 404)
        );
    }

    // If content is missing, try to scrape it now
    if (!bookmark.content) {
        const scapedData = await scrapeUrl(bookmark.url);
        if (scapedData && scapedData.content) {
            bookmark.content = scapedData.content;
            bookmark.summary = bookmark.summary || scapedData.summary;
            await bookmark.save();
        }
    }

    res.status(200).json({
        success: true,
        data: {
            title: bookmark.title,
            content: bookmark.content || '<p>Content could not be extracted from this URL.</p>'
        }
    });
});

// @desc    Delete bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
exports.deleteBookmark = asyncHandler(async (req, res, next) => {
    const bookmark = await Bookmark.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!bookmark) {
        return next(
            new ErrorResponse(`Bookmark not found with id of ${req.params.id}`, 404)
        );
    }

    await bookmark.deleteOne();

    // Log activity
    await ActivityLog.create({
        userId: req.user.id,
        bookmarkId: req.params.id,
        action: 'DELETE'
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Bulk delete bookmarks
// @route   POST /api/bookmarks/bulk-delete
// @access  Private
exports.bulkDelete = asyncHandler(async (req, res, next) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
        return next(new ErrorResponse('Please provide an array of bookmark IDs', 400));
    }

    await Bookmark.deleteMany({
        _id: { $in: ids },
        userId: req.user.id
    });

    // Log activities for each (simplified to one log for bulk)
    await ActivityLog.create({
        userId: req.user.id,
        action: 'BULK_DELETE',
        details: `Deleted ${ids.length} bookmarks`
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Bulk update bookmark status
// @route   POST /api/bookmarks/bulk-update-status
// @access  Private
exports.bulkUpdateStatus = asyncHandler(async (req, res, next) => {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || !status) {
        return next(new ErrorResponse('Please provide an array of bookmark IDs and a status', 400));
    }

    await Bookmark.updateMany(
        { _id: { $in: ids }, userId: req.user.id },
        { $set: { status } }
    );

    // Log activity
    await ActivityLog.create({
        userId: req.user.id,
        action: 'BULK_UPDATE',
        details: `Updated ${ids.length} bookmarks to status: ${status}`
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});
