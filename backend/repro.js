const express = require('express');
const asyncHandler = require('express-async-handler');

const app = express();

const protect = asyncHandler(async (req, res, next) => {
    console.log('Protect middleware called');
    next();
});

const createBookmark = asyncHandler(async (req, res, next) => {
    console.log('Create bookmark called');
    throw new Error('Test Error');
});

app.use(protect);
app.post('/api/bookmarks', createBookmark);

app.use((err, req, res, next) => {
    console.log('Error Handler caught:', err.message);
    res.status(500).json({ error: err.message });
});

const server = app.listen(5001, () => {
    console.log('Test server running on 5001');
    // We can't easily trigger a POST request here without curl, but let's see if it starts.
    process.exit(0);
});
