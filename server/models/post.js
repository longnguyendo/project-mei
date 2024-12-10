const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // comments: {
    //     type: String,
    // },
    createAT: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    },
    
})

module.exports = mongoose.model('Post', PostSchema);