const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Connecting to:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });
