"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const { mongoose } = require('../configs/dbConnection')

/* ------------------------------------------------------- */

const BlogSchema = new mongoose.Schema(
    {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    isPublish: {
        type: Boolean,
        // default: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    countOfVisitors: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    },
    {collection: "blogs", timestamps: true}
)

module.exports = mongoose.model('Blog', BlogSchema);