const mongoose = require('mongoose');
const modelOptions = require('./modelOptions.js');

module.exports = mongoose.model(
    'Favorite',
    mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
                required: true,
            },
        },
        modelOptions
    )
);
