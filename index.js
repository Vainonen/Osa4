const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const config = require('./utils/config')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/*
mongoose
  .connect(process.env.MONGODB_URI)
  .then( () => {
    console.log('connected to database', process.env.MONGODB_URI)
  })
  .catch( err => {
    console.log(err)
  })
*/
  
mongoose
.connect(config.mongoUrl)
.then( () => {
  console.log('connected to database', config.mongoUrl)
})
.catch( err => {
  console.log(err)
})

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)

app.use('/api/blogs', blogRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
/*
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
})
*/