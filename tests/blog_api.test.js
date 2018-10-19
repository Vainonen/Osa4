const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]
  
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

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are seven blogs', async () => {
    const response = await api
      .get('/api/blogs')
  
    expect(response.body.length).toBe(6)
  })
  
  test('the first blog is about React patterns', async () => {
    const response = await api
      .get('/api/blogs')
  
    expect(response.body[0].title).toBe('React patterns')
  })
  
  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
  
    expect(response.body.length).toBe(initialBlogs.length)
  })
  
  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
  
    expect(titles).toContain('Canonical string reduction')
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'blokkerin bloki',
      author: "Blah Blah",
      url: "http://bloki.org",
      likes: 1,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api
      .get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
  
    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('blokkerin bloki')
  })
  
  test('a blog has 0 likes as a default', async () => {
    const newBlog = {
      title: 'Dislike this',
      author: "Unlikeable",
      url: "http://com.com"
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api
      .get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
  
    
    const title = response.body.find(r => r.title === 'Dislike this')
    expect(title.likes).toBe(0)
  })

afterAll(() => {
  server.close()
})