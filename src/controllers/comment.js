"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const Comment = require('../models/comment')
const Blog = require('../models/blog') 

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "List Comments"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
        const data = await res.getModelList(Comment)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Comment),
            data,
          });
    },
    create: async (req, res) => {
        /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Update Comment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                   "name": "Comment 1"
                }
            }
        */

        req.body.userId = req.user._id;


        const data = await Comment.create(req.body)

        await Blog.findByIdAndUpdate(req.body.blogId, {
            $push: { comments: data._id }
        });

        res.status(201).send({
            error: false,
            data,
          })
    },
    read: async (req, res) => {
        /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Get Single Comment"
        */
            const data = await Comment.findOne({ _id: req.params.id });

            res.status(200).send({
                error: false,
                data,
              });
    },
    update: async (req, res) => {
        /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Update Comment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                   "name": "Comment 1"
                }
            }
        */

        const comment = await Comment.findOne({ _id: req.params.id })

        if (req.user._id.toString() === comment.userId.toString() || req.user.isAdmin) {

            delete req.body.userId;
            
            const data = await Comment.updateOne({ _id: req.params.id }, req.body, { runValidators: true });

            res.status(202).send({
                error: false,
                data,
                new: await Comment.findOne({ _id: req.params.id }),
            });
        } else {
            res.status(403).send({
                error: true,
                message: 'NoPermission: You do not have permission to update this Comment.',
            });
        }
    },
    delete: async (req, res) => {
        /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Delete Comment"
        */

        const comment = await Comment.findOne({ _id: req.params.id })

        if (!comment) {
            return res.status(404).send({
                error: true,
                message: 'Comment not found',
            });
        }

        if (req.user._id.toString() === comment.userId.toString() || req.user.isAdmin) {
            const data = await Comment.deleteOne({ _id: req.params.id });

            if (data.deletedCount) {
                await Blog.findByIdAndUpdate(comment.blogId, {
                    $pull: { comments: req.params.id }
                });

                res.status(204).send({
                    error: false,
                    message: 'Comment deleted successfully',
                });
            } else {
                res.status(404).send({
                    error: true,
                    message: 'Comment not found',
                });
            }
        } else {
            res.status(403).send({
                error: true,
                message: 'NoPermission: You do not have permission to delete this Comment.',
            });
        }
    },
   
}