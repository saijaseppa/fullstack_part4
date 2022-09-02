const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/test_helper')
const jwt = require('jsonwebtoken')

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

  /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }*/
  //const user = await User.findById(decodedToken.id)
  const user = request.user

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
  /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }*/
  //Tokenin perusteella haettu user
  //const user = await User.findById(decodedToken.id)
  const user = request.user
  console.log('user requestista', user);
  
  //Haettu blogi
  const blog = await Blog.findById(request.params.id)
  console.log('blogi requestista', blog);
  

  console.log('blogin user', blog.user.id.toString());
  console.log('userin id', user.id.toString());

  if (blog.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'users can remove only ther own blogs' })
  }

  //TOIMIIKO???? pitäisi.
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  //console.log('request: ', request.body);
  const body = request.body;

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  }

  const modifBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(201).json(modifBlog)
})



module.exports = blogsRouter