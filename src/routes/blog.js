"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

const blog = require('../controllers/blog')

const {isLogin} = require('../middlewares/permissions')

// URL: /blogs

router.route("/")
  .get(blog.list)
  .post(isLogin, blog.create);

router.route("/:id")
  .get(isLogin, blog.read)
  .put(isLogin, blog.update)
  .patch(isLogin, blog.update)
  .delete(isLogin, blog.delete);

router.route("/:id/getLike").get(isLogin, blog.getLike)

router.route("/:id/postLike").post(isLogin, blog.postLike)

/* ------------------------------------------------------- */
module.exports = router;
