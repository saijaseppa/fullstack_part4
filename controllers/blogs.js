const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  
  /*Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })*/
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    author:body.author,
    title: body.title || undefined,
    url: body.url || undefined,
    likes: body.likes || 0
  })

  if (blog.url === undefined || blog.title === undefined) {
    response.status(400).end()
  }
  else {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
  /*blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
    */
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  console.log('request: ', request.body);
  const body = request.body;

  const blog = {
    //id: body.id,
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  }

  const modifBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(201).json(modifBlog)
})



module.exports = blogsRouter