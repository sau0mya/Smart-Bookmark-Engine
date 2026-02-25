const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot be more than 200 characters']
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    bookmarks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Bookmark'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Update the updatedAt field on save
CollectionSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Collection', CollectionSchema);
