const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    bookmarkId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bookmark'
    },
    action: {
        type: String,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'VISIT', 'FAVORITE', 'BULK_DELETE', 'BULK_UPDATE'],
        required: true
    },
    details: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
