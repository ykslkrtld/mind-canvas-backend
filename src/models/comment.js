"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const { mongoose } = require('../configs/dbConnection')

/* ------------------------------------------------------- */

const CommentSchema = new mongoose.Schema(
    {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    comment: {
        type: String,
        trim: true,
        required: true,
    }
    },
    {collection: "blogs", timestamps: true}
)

module.exports = mongoose.model('Blog', BlogSchema);