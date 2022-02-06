const mongoose = require('mongoose');

// .Env
const dotenv = require('dotenv');
dotenv.config();

let mongoDB = process.env.MONGOOSE_URI
    .replace("{MONGOOSE_DATABASE_HOST}", process.env.MONGOOSE_DATABASE_HOST)
    .replace("{MONGOOSE_DATABASE_PORT}", process.env.MONGOOSE_DATABASE_PORT)
    .replace("{MONGOOSE_DATABASE_NAME}", process.env.MONGOOSE_DATABASE_NAME);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

module.exports = db;
