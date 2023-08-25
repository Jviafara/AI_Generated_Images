const mongoose = require('mongoose');
const modelOptions = require('./modelOptions');

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        prompt: { type: String, required: true },
        image: { type: String, required: true },
    },
    modelOptions
);

const Post = mongoose.model('Posts', postSchema);
module.exports = Post;
