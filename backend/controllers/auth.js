const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log(`[AUTH] Attempting registration for: ${email}`);

    // Create user
    try {
        const user = await User.create({
            name,
            email,
            password
        });
        console.log(`[AUTH] User registered successfully: ${email}`);
        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error(`[AUTH] Registration error for ${email}:`, err.message);
        return next(err);
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Attempting login for: ${email}`);

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        console.warn(`[AUTH] Login failed: User not found (${email})`);
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        console.warn(`[AUTH] Login failed: Incorrect password for ${email}`);
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    console.log(`[AUTH] User logged in successfully: ${email}`);
    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token
    });
};
