const blog = require("../models/blog")
const logger = require("./logger")


const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumWithInitial = blogs.reduce((accumulator, currentValue, indice) => accumulator + blogs[indice].likes,0,)
  //logger.info(sumWithInitial);
  return sumWithInitial 
}

const favoriteBlog = (blogs) => {

  if(blogs.length === 0)
    return 0

  const mostLikedBlog = blogs.reduce((mostLiked, currentBlog) => {
    return (currentBlog.likes > mostLiked.likes) ? currentBlog : mostLiked;
  });
  //logger.info(mostLikedBlog);
  const returnBlog = {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
  //logger.info(mostLikedBlog);

  return returnBlog

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
