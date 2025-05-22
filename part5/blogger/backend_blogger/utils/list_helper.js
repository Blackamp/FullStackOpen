const blog = require("../models/blog")
const logger = require("./logger")

//Biblioteca Lodash 
var lodash = require('lodash') // Load the fp build.


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

const mostBlogs = (blogs) => {

  if(blogs.length === 0)
    return 0

  const authorBlogsCount = lodash.countBy(blogs, "author");
  //logger.info("Author: ",authorBlogsCount);
  const arrayAuthorCount = Object.entries(authorBlogsCount)
  //logger.info("Author: ",arrayAuthorCount);
  const topWritter = arrayAuthorCount.reduce((topAuthor, currentAuthor) => {
    return (currentAuthor > topAuthor) ? currentAuthor : topAuthor;
  });

  //logger.info("Top", topWritter);

  const result = {
    author: topWritter[0],
    blogs: topWritter[1]
  }

  return result

}

const mostLikes  = (blogs) => {

  
  if(blogs.length === 0)
    return 0

  const blogsGroupByAuthor = lodash.groupBy(blogs, "author");

  const countLikesAutor = []

  for (let prop in blogsGroupByAuthor){
    //logger.info("For prop", prop)
    //logger.info("DAtos de prop",authorBlogsCount[prop])
    const totalLikes = blogsGroupByAuthor[prop].reduce((accumulator, currentValue, indice) => {
      return accumulator + blogsGroupByAuthor[prop][indice].likes
    },0)
    //logger.info("TOTAL ", totalLikes)

    countLikesAutor.push({
      author: prop,
      likes: totalLikes
    })
  }

  const mostLikedAuthor = countLikesAutor.reduce((mostLiked, currentAuthor) => {
    return (currentAuthor.likes > mostLiked.likes) ? currentAuthor : mostLiked;
  });

  return mostLikedAuthor

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
