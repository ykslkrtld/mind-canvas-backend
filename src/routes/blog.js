"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

const blog = require('../controllers/blog')

// URL: /blogs

router.route("/")
  .get(blog.list)
  .post(blog.create);

router.route("/:id")
  .get(blog.read)
  .put(blog.update)
  .patch(blog.update)
  .delete(blog.delete);

router.route("/:id/getLike").get(blog.getLike)

router.route("/:id/postLike").post(blog.postLike)

/* ------------------------------------------------------- */
module.exports = router;
