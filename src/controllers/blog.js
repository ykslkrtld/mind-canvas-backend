"use strict"
/* -------------------------------------------------------
    | Mind Canvas |
------------------------------------------------------- */

const Blog = require('../models/blog')

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
        const data = await res.getModelList(Blog)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Blog),
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
        const data = await Blog.findByIdAndUpdate(
            req.params.id, 
            { $inc: { countOfVisitors: 1 } },
            { new: true }
        );
    
        res.status(200).send({
            error: false,
            data,
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
        const data = await Blog.updateOne({ _id: req.params.id }, req.body, {runValidators: true})

        req.body.userId = req.user._id;

        res.status(202).send({
            error: false,
            data,
            new: await Blog.findOne({ _id: req.params.id }),
          });
    },
    delete: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Delete Blog"
        */
        const data = await Blog.deleteOne({ _id: req.params.id });

        res.status(data.deletedCount ? 204 : 404).send({
          error: !data.deletedCount,
          data,
        });
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
    
        // Update the count of likes
        data.countOfLikes = data.likes.length;
    
        // Save the updated blog
        const updatedBlog = await data.save();
    
        // Return the response
        res.status(200).send({
            error: false,
            countOfLikes: updatedBlog.countOfLikes,
            didUserLike: updatedBlog.likes.includes(userId)
        });
    }
            
}