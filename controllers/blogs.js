const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/test_helper')
const jwt = require('jsonwebtoken')

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}*/

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
  
  /*Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })*/
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    author:body.author,
    title: body.title || undefined,
    url: body.url || undefined,
    likes: body.likes || 0,
    user: user._id
  })

  if (blog.url === undefined || blog.title === undefined) {
    response.status(400).end()
  }
  else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
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
  //console.log('request: ', request.body);
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