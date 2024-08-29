"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const router = require('express').Router()

/* ------------------------------------------------------- */

const token = require('../controllers/token')

// URL: /tokens

const { isAdmin } = require('../middlewares/permissions')

// router.use(isAdmin)

router.route('/')
    .get(token.list)
    .post(token.create)

router.route('/:id')
    .get(token.read)
    .put(token.update)
    .patch(token.update)
    .delete(token.delete)

/* ------------------------------------------------------- */
module.exports = router