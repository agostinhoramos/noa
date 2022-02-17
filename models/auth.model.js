const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Auth = new Schema({
    fingerprint: {
        type: String,
        required: true
    },
    ip_address: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Export model
module.exports =  mongoose.model(
    'Auth',
    Auth
);
