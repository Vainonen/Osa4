const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper')


/* 
  beforeAll(async () => {
    await Blog.remove({})
    console.log('cleared')
  
    initialBlogs.forEach(async (blog) => {
      let blogObject = new Blog(blog)
      await blogObject.save()
      console.log('saved')
    })
    console.log('done')
  })
*/

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

test('blogs are returned as json', async () => {
  const blogsInDatabase = await blogsInDb()

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.length).toBe(blogsInDatabase.length)
  const returnedContents = response.body.map(b => b.content)
  blogsInDatabase.forEach(blog => {
    expect(returnedContents).toContain(blog.content)
  })

})

test('there are six blogs', async () => {
    const blogsInDatabase = await blogsInDb()
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(blogsInDatabase.length)
    expect(response.body.length).toBe(6)
  })
  
  test('the first blog is about React patterns', async () => {
    const blogsInDatabase = await blogsInDb()
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(blogsInDatabase.length)
    expect(response.body[0].title).toBe('React patterns')
  })
  
  test('all blogs are returned', async () => {
    const blogsInDatabase = await blogsInDb()
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(blogsInDatabase.length)
    expect(response.body.length).toBe(initialBlogs.length)
  })
  
  test('a specific blog is within the returned blogs', async () => {
    const blogsInDatabase = await blogsInDb()
    const response = await api
      .get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
    expect(response.body.length).toBe(blogsInDatabase.length)
    expect(titles).toContain('Canonical string reduction')
  })

  describe('addition of a new blog', async () => {

    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'blokkerin bloki',
        author: "Blah Blah",
        url: "http://bloki.org",
        likes: 1,
        id: "wegwegwgwgwgwg"
      }
      
      const blogsBefore = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const blogsAfter = await blogsInDb()
      /*
      const response = await api
        .get('/api/blogs')
      
      const titles = response.body.map(r => r.title)
    

      expect(response.body.length).toBe(initialBlogs.length + 1)
      expect(titles).toContain('blokkerin bloki')
      */
      const titles = blogsAfter.map(r => r.title)
      expect(blogsAfter.length).toBe(blogsBefore.length+1)
      expect(titles).toContain('blokkerin bloki')
    })
    
    test('a blog has 0 likes as a default', async () => {
      const newBlog = {
        title: 'Dislike this',
        author: "Unlikeable",
        url: "http://com.com"
      }
    
      const blogsBefore = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
      const blogsAfter = await blogsInDb()
      /*
      const response = await api
        .get('/api/blogs')
      
      const titles = blogsAfter.body.map(r => r.title)
      */

      const title = blogsAfter.find(r => r.title === 'Dislike this')
      expect(title.likes).toBe(0)
    })

    test('a blog without title or url cannot be added', async () => {
      const newBlog = {
        author: "Without titles",
        url: "http://com.com"
      }
      
      const blogsBefore = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const anotherBlog = {
        title: "Without URL",
        author: "Without titles"
      }
    
      await api
        .post('/api/blogs')
        .send(anotherBlog)
        .expect(400)

      const blogsAfter = await blogsInDb() 
      expect(blogsAfter.length).toBe(blogsBefore.length)   
    })
  })

  describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
      addedBlog = new Blog({
        title: 'Delete this',
        author: "Deletable",
        likes: 1,
        url: "http://com.com"
      })
      await addedBlog.save()
    })

    test('DELETE succeeds with proper statuscode', async () => {
      const blogsBefore = await blogsInDb()
      const blogObject = blogsBefore.filter(blog => blog.title === "Delete this")

      await api
        .delete('/api/blogs/' + blogObject[0].id)
        .expect(204)

      const blogsAfter = await blogsInDb()
      const titles = blogsAfter.map(r => r.title)
      expect(titles).not.toContain(addedBlog.title)
      expect(blogsAfter.length).toBe(blogsBefore.length - 1)
    })
  })

  describe.only('when there is initially one user at db', async () => {
    beforeAll(async () => {
      await User.remove({})
      const user = new User({ username: 'root', password: 'sekret' })
      await user.save()
    })
  
    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await usersInDb()
  
      const newUser = {
        username: 'kmh',
        name: 'Kuka mitä häh?',
        password: 'tiikeri'
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
      const usernames = usersAfterOperation.map(u=>u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
      const usersBeforeOperation = await usersInDb()
    
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body).toEqual({ error: 'username must be unique'})
    
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

  })

  afterAll(() => {
    server.close()
  })

})  