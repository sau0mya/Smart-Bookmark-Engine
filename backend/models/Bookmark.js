const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    url: {
        type: String,
        required: [true, 'Please add a URL'],
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: [String],
        default: ['General']
    },
    status: {
        type: String,
        enum: ['favorite', 'archived', 'normal'],
        default: 'normal'
    },
    visitCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    summary: {
        type: String,
        maxlength: [1000, 'Summary cannot be more than 1000 characters']
    },
    content: {
        type: String // Detailed content for Reading Mode
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexing for fast search
BookmarkSchema.index({ title: 'text', description: 'text' });
BookmarkSchema.index({ category: 1 });
BookmarkSchema.index({ url: 1 });

// Update the updatedAt field on save
BookmarkSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
