"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const router = require('express').Router()

/* ------------------------------------------------------- */
// routes/:

// URL: /

// auth:
router.use('/auth', require('./auth'))
// user:
router.use('/users', require('./user'))
// token:
router.use('/tokens', require('./token'))


// category:
router.use('/categories', require('./category'))
// blog:
router.use('/blogs', require('./blog'))
// comment:
router.use('/comments', require('./comment'))


/* ------------------------------------------------------- */
module.exports = router