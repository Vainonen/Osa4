const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

/*
blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  */

  const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    console.log("authorization")
    console.log(request)
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

  blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1})
    console.log(blogs)
    response.json(blogs.map(Blog.format))
  })

  blogsRouter.get('/:id', async (request, response) => {
    try {
      const blog = await Blog.findById(request.params.id)
  
      if (blog) {
        response.json(Blog.format(blog))
      } else {
        response.status(404).end()
      }
  
    } catch (e) {
      console.log(e)
      response.status(400).send({ error: 'malformatted id' })
    }
  })

  blogsRouter.delete('/:id', async (request, response) => {
    try {
      await Blog.findByIdAndRemove(request.params.id)
      console.log("here")
      response.status(204).end()
    } catch (e) {
      console.log(e)
      response.status(400).send({ error: 'malformatted id' })
    }
  })

  blogsRouter.post('/', async (request, response) => {
    const body = request.body
    try {
      const token = getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      
      console.log("token")
      console.log(token)
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      
      if (body.title === undefined || body.url === undefined) {
        return response.status(400).json({ error: 'title and URL required' })
      }

      const user = await User.findById(body.user)
      
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        date: new Date(),
        user: user._id
      })
      
      

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.json(Blog.format(blog))
    } catch(exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        response.status(401).json({ error: exception.message })
      } else {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
    }
  })
    
  /*
  blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  */
  module.exports = blogsRouter