const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

/*
blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  */
  blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })

  blogsRouter.get('/:id', async (request, response) => {
    try {
      const blog = await Blog.findById(request.params.id)
  
      if (blog) {
        response.json(blog)
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
  
      response.status(204).end()
    } catch (e) {
      console.log(e)
      response.status(400).send({ error: 'malformatted id' })
    }
  })

  blogsRouter.post('/', async (request, response) => {
    try {
      const body = new Blog(request.body)
      
      if (body.title === undefined) {
        return response.status(400).json({ error: 'title missing' })
      }

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
      })

      const savedBlog = await blog.save()
      response.json(savedBlog)

      /*
      blog
        .save()
        .then(result => {
          response.status(201).json(result)
        })
      */  
      }
      catch (e) {
        console.log(e)
        response.status(500).json({ error: 'something went wrong...' })
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