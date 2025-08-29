const mongoose = require('mongoose')

// Definimos el Schema para la BBDD
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  comments: [String],
  user:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    
})

/*Formateamos los objetos devueltos por Mongoose para convertir a string 
   el id (era objeto) y para no retornar el control de versiones*/
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports =  mongoose.model('Blog', blogSchema)