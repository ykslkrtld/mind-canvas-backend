"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const router = require('express').Router()

/* ------------------------------------------------------- */
// routes/:

// URL: /

// user:
router.use('/users', require('./user'))
// token:
router.use('/tokens', require('./token'))


/* ------------------------------------------------------- */
module.exports = router