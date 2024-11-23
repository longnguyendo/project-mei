const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Date,
        default: "user",
    },
})

module.exports = mongoose.model('Admin', AdminSchema);
