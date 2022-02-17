const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Noa = new Schema({
    title: {
        type: String,
        required: true,
        min: 2, max: 180
    },
    desc: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId
    }
}, { timestamps: true });

// Export model
module.exports =  mongoose.model(
    'Noa',
    Noa
);
