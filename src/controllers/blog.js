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
        const data = await Blog.create(req.body)

        res.status(201).send({
            error: false,
            data,
          });
    },
    read: async (req, res) => {
        /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Get Single Blog"
        */
        const data = await Blog.findOne({ _id: req.params.id });

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
            const data = await Blog.findById(req.params.id).select('likes');
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
        const { userId } = req.body;

        const data = await Blog.findById(req.params.id);
    
        if (!data) {
            return res.status(404).send({ 
                error: true, 
                message: 'Blog not found' 
            });
        }
    
        if (data.likes.includes(userId)) {
            data.likes = data.likes.filter(id => id !== userId);
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