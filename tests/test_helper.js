const Blog = require('../models/blog')

const initialBlogs = [
  {
    author: 'meme king',
    title: 'Best Memes',
    url: 'urlHere',
    likes: 5
  },
  {
    author: 'new One',
    title: 'new title',
    url: 'newUrl',
    likes: 1
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

/*const nonExistingId = async () => {
  const note = new Blog({ content: 'willremovethissoon', date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}*/

module.exports = {
  initialBlogs, blogsInDb
}