"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const { mongoose } = require('../configs/dbConnection')

/* ------------------------------------------------------- */

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            index: true,
        },
        firstName: {
            type: String,
            trim: true,
            required: true
        },
        lastName: {
            type: String,
            trim: true,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isStaff: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },bio: {
            type: String,
            trim: true,
        },
}, 

{ collection: "users", timestamps: true }

);

/* ------------------------------------------------------- */

module.exports = mongoose.model("User", UserSchema)

