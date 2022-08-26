const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')



beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  /*let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()*/
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(contents).toContain(
    'Best Memes'
  )
})

test('a valid blog can be added', async () => {
  const newBlog = {
    author: 'new test',
    title: 'test title',
    url: 'urlTest',
    likes: 9
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain('test title')
})

test('All blogs are identified by field id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body);
  
  const keys = response.body.map(b => Object.keys(b))
  console.log('ids', keys);
  
  expect(keys[0]).toContain('id')


})

test('When amount of likes is not given, likes will be zero', async () => {
  const newBlog = {
    author: 'zero',
    title: 'zero title',
    url: 'urlZero'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

  const newestBlog = [...blogsAtEnd].pop()
  expect(newestBlog.likes).toBe(0)
})

test('When posting blog without url, bad request is given', async () => {
  const newBlog = {
    author: 'zero',
    title: 'zero title',
    likes: 8
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('When posting blog without title, bad request is given', async () => {
  const newBlog = {
    author: 'zero',
    url: 'zeroUrl',
    likes: 8
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('deleting a blog with id is working', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
   .delete(`/api/blogs/${blogToDelete.id}`)
   .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length-1)

  const titles = blogsAtEnd.map (b => b.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('Modifying likes of a blog is possible and working', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModify = blogsAtStart[0]

  const newInfo = {
    author: blogToModify.author,
    title: blogToModify.title,
    url: blogToModify.url,
    likes: blogToModify.likes+1
  }

  await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(newInfo)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd[0].likes).toBe(blogToModify.likes+1)

})

afterAll(() => {
  mongoose.connection.close()
})

