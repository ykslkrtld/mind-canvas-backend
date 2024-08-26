"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const { mongoose } = require('../configs/dbConnection')

/* ------------------------------------------------------- */

const UserSchema = new mongoose.Schema(
    {
        

}, 

{ collection: "users", timestamps: true }

);

module.exports = mongoose.model("User", UserSchema)

