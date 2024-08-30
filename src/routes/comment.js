"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

const comment = require('../controllers/comment')

// URL: /comments

const {isLogin} = require('../middlewares/permissions')

router.use(isLogin)

router.route("/")
  .get(comment.list)
  .post(comment.create);

router.route("/:id")
  .get(comment.read)
  .put(comment.update)
  .patch(comment.update)
  .delete(comment.delete);

/* ------------------------------------------------------- */
module.exports = router;
