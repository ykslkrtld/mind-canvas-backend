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

    },
    {collection: "categories", timestamps: true}
)
