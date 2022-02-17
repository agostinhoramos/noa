const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Access = new Schema({
    passwd: {
        type: String,
        required: true
    },
    enabled: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Export model
module.exports =  mongoose.model(
    'Access',
    Access
);
