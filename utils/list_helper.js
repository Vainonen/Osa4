const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    var count = 0
    blogs.forEach((blog) => {
        count += blog.likes
      })
    return count
}

const favoriteBlog = (blogs) => {
    var maximum = 0
    blogs.forEach((blog) => {
        if (blog.likes > maximum) {
            maximum = blog.likes
        }
      })
    var favorite = {}
      blogs.forEach((blog) => {
        if (blog.likes == maximum) {
            favorite = blog
        }
      })  
    if (favorite) return favorite
    return null  
} 

const mostBlogs = (blogs) => {
    var authors = {}
    blogs.forEach((blog) => {
        if (blog.author in authors) {
            authors[blog.author] = authors[blog.author] + 1
        }
        else {
            authors[blog.author] = 1
        }
      })
    var maximum = 0
    Object.keys(authors).forEach((key) => {
        if (authors[key] > maximum) {
            maximum = authors[key]
        }
      })
    var favorite = {}
    Object.keys(authors).forEach((key) => {
        if (authors[key] == maximum) {
            favorite = key
        }
      })  
    if (favorite) return {"author": favorite, "blogs": maximum}
    return null  
} 

const mostLikes = (blogs) => {
    var authors = {}
    blogs.forEach((blog) => {
        if (blog.author in authors) {
            authors[blog.author] = authors[blog.author] + blog.likes
        }
        else {
            authors[blog.author] = blog.likes
        }
      })
    var maximum = 0
    Object.keys(authors).forEach((key) => {
        if (authors[key] > maximum) {
            maximum = authors[key]
        }
      })
    var favorite = {}
    Object.keys(authors).forEach((key) => {
        if (authors[key] == maximum) {
            favorite = key
        }
      })  
    if (favorite) return {"author": favorite, "likes": maximum}
    return null  
} 

module.exports = {
    dummy,
    favoriteBlog,
    totalLikes,
    mostBlogs,
    mostLikes
  }  