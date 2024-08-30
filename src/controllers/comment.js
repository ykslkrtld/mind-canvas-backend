"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const Comment = require('../models/comment')

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
            #swagger.summary = "Create Comment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                   "comment": Comment-1
                }
            }
        */

        req.body.userId = req.user._id;

        const data = await Comment.create(req.body)

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
                    "comment": Comment-1
                }
            }
        */

        const Comment = await Comment.findOne({ _id: req.params.id })

        if (req.user._id.toString() === Comment.userId.toString() || req.user.isAdmin) {
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

        const Comment = await Comment.findOne({ _id: req.params.id })

        if (!Comment) {
            return res.status(404).send({
                error: true,
                message: 'Comment not found',
            });
        }

        if (req.user._id.toString() === Comment.userId.toString() || req.user.isAdmin) {
            const data = await Comment.deleteOne({ _id: req.params.id });

            res.status(data.deletedCount ? 204 : 404).send({
                error: !data.deletedCount,
                data,
            });
        } else {
            res.status(403).send({
                error: true,
                message: 'NoPermission: You do not have permission to delete this Comment.',
            });
        }
    },
   
}