"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const Blog = require('../models/blog')
const Comment = require('../models/comment')

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "List Blogs"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        // const authorId = req.query.author;

        // const customFilter = { isPublish: true };
        // if (authorId) {
        //     customFilter.userId = authorId;
        // }

        const data = await res.getModelList(Blog, customFilter)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Blog, customFilter),
            data,
          });
    },
    create: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Create Blog"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                   "categoryId": "65343222b67e9681f937f101",
                    "title": "Blog Title 1",
                    "content": "Blog Content 1",
                    "image": "http://imageURL",
                    "isPublish": true
                }
            }
        */

        req.body.userId = req.user._id;

        const data = await Blog.create(req.body)

        res.status(201).send({
            error: false,
            data,
          })
    },
    read: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Get Single Blog"
        */

        const blogId = req.params.id;

        // Yorumları al
        const comments = await Comment.find({ blogId });

        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            { $inc: { countOfVisitors: 1 } },
            { new: true }
        ).populate([
            { path: 'userId', select: 'username firstName lastName' },
            { path: 'categoryId' }
        ]);
    
        res.status(200).send({
            error: false,
            data: blog,
            comments
        });
    },
    update: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Update Blog"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                   "categoryId": "65343222b67e9681f937f101",
                    "title": "Blog Title 1",
                    "content": "Blog Content 1",
                    "image": "http://imageURL",
                    "isPublish": true
                }
            }
        */

        const blog = await Blog.findOne({ _id: req.params.id })

        if (req.user._id.toString() === blog.userId.toString() || req.user.isAdmin) {
            const data = await Blog.updateOne({ _id: req.params.id }, req.body, { runValidators: true });

            res.status(202).send({
                error: false,
                data,
                new: await Blog.findOne({ _id: req.params.id }),
            });
        } else {
            res.status(403).send({
                error: true,
                message: 'NoPermission: You do not have permission to update this blog.',
            });
        }
    },
    delete: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Delete Blog"
        */

        const blog = await Blog.findOne({ _id: req.params.id })

        if (!blog) {
            return res.status(404).send({
                error: true,
                message: 'Blog not found',
            });
        }

        if (req.user._id.toString() === blog.userId.toString() || req.user.isAdmin) {
            const data = await Blog.deleteOne({ _id: req.params.id });

            res.status(data.deletedCount ? 204 : 404).send({
                error: !data.deletedCount,
                data,
            });
        } else {
            res.status(403).send({
                error: true,
                message: 'NoPermission: You do not have permission to delete this blog.',
            });
        }
    },
    getLike: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Get Like Info"
        */
            const data = await Blog.findOne({ _id: req.params.id }).select('likes');
            if (!data) {
                return res.status(404).send({ error: true, message: 'Blog not found' });
            }
            res.status(200).send({ 
                error: false, 
                likes: data.likes.length
        });
    },
    postLike: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Like or Unlike Blog"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {}
            }
        */
    
        const userId = req.user._id;
    
        const data = await Blog.findOne({ _id: req.params.id });
    
        if (data.likes.includes(userId)) {
            data.likes = data.likes.filter(id => id.toString() !== userId.toString()); 
        } else {
            data.likes.push(userId);
        }
    
        data.countOfLikes = data.likes.length;
    
        const updatedBlog = await data.save();
    
        res.status(200).send({
            error: false,
            countOfLikes: updatedBlog.countOfLikes,
            didUserLike: updatedBlog.likes.includes(userId)
        });
    }
            
}