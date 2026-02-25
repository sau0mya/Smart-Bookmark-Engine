const ErrorResponse = require('../utils/errorResponse');
const Collection = require('../models/Collection');
const asyncHandler = require('../middleware/async');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Private
exports.getCollections = asyncHandler(async (req, res, next) => {
    const collections = await Collection.find({ userId: req.user.id }).populate('bookmarks');

    res.status(200).json({
        success: true,
        count: collections.length,
        data: collections
    });
});

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Private
exports.getCollection = asyncHandler(async (req, res, next) => {
    const collection = await Collection.findOne({
        _id: req.params.id,
        userId: req.user.id
    }).populate('bookmarks');

    if (!collection) {
        return next(
            new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: collection
    });
});

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
exports.createCollection = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.userId = req.user.id;

    const collection = await Collection.create(req.body);

    res.status(201).json({
        success: true,
        data: collection
    });
});

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
exports.updateCollection = asyncHandler(async (req, res, next) => {
    let collection = await Collection.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!collection) {
        return next(
            new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404)
        );
    }

    collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: collection
    });
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
exports.deleteCollection = asyncHandler(async (req, res, next) => {
    const collection = await Collection.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!collection) {
        return next(
            new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404)
        );
    }

    await collection.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Add bookmarks to collection
// @route   PUT /api/collections/:id/add-bookmarks
// @access  Private
exports.addBookmarksToCollection = asyncHandler(async (req, res, next) => {
    const { bookmarkIds } = req.body;

    let collection = await Collection.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!collection) {
        return next(new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404));
    }

    // Add bookmarks and ensure no duplicates
    collection.bookmarks = [...new Set([...collection.bookmarks.map(id => id.toString()), ...bookmarkIds])];
    await collection.save();

    res.status(200).json({
        success: true,
        data: collection
    });
});

// @desc    Remove bookmarks from collection
// @route   PUT /api/collections/:id/remove-bookmarks
// @access  Private
exports.removeBookmarksFromCollection = asyncHandler(async (req, res, next) => {
    const { bookmarkIds } = req.body;

    let collection = await Collection.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!collection) {
        return next(new ErrorResponse(`Collection not found with id of ${req.params.id}`, 404));
    }

    collection.bookmarks = collection.bookmarks.filter(
        id => !bookmarkIds.includes(id.toString())
    );
    await collection.save();

    res.status(200).json({
        success: true,
        data: collection
    });
});
