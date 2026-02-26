require("dotenv").config();

const app = require("./app");

// The database connection is already initiated in app.js via connectDB()
// We just need to ensure the environment variables are available.
if (!process.env.MONGODB_URI) {
    console.error("❌ CRITICAL: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("❌ CRITICAL: JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
});