const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Programar con React y Node",
    author: "Black",
    url: "www.blackevelop.com",
    likes: 787
  },
  {
    title: "Travel around the world",
    author: "BlackTravel",
    url: "www.travelworld.com",
    likes: 1114
  },
  {
    title: "Receta de carbonara",
    author: "BlackCooking",
    url: "www.bcook.com",
    likes: 444
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}