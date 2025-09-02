const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql');
const { startStandaloneServer } = require('@apollo/server/standalone')
const { gql } = require('graphql-tag')
const { v4: uuid } = require('uuid');
const Author = require('./models/author')
const Book = require('./models/book');
const User = require('./models/user');
const jwt = require('jsonwebtoken')



let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    born: Int 
    id: ID!
    bookCount: Int!
  }
  
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]! 
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]! 
    ): Book
    editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
}
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => { 
    
      console.log("Query - AllBooks")

      if(!args.author && !args.genre) {
        //Sin parámetros
        return await Book.find({}).populate('author');
      }
      else if(!args.author && args.genre) {
        // Filtro género del libro
        return await Book.find({ genres: { $in: [args.genre] } }).populate('author')
      } 
      else {
        // Buscar el author por nombre
        const author = await Author.findOne({ name: args.author });
        if (!author) return []; // si no existe, devuelve vacío

        // Buscar los libros de ese author en función de si tenemos filtro de género
        if(args.genre) {
          // Filtamos por autor + género
          return await Book.find({ author: author._id, genres: {$in: [args.genre]} }).populate('author');
        }else{  
          // Filtramos solo autor
          return await Book.find({ author: author._id }).populate('author');
        }
      }
    },
    allAuthors: async () => {

      console.log("Query - AllAuthor")

      const allAuthor = await Author.find({});
      const allBooks = await Book.find({}).populate('author');

      const authorsWithNumBooks = allAuthor.map(a => {
        const plainAuthor = a.toObject() // 👈 convierte en objeto JS plano
        return {
          ...plainAuthor,
          bookCount: allBooks.filter(b => b.author.name === a.name).length
        }
      });
      return authorsWithNumBooks;
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      // buscamos el autor
      let author = await Author.findOne({ name: args.author });

      // si no existe, lo creamos
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: { code: 'BAD_USER_INPUT', invalidArgs: args }
          });
        }
      }

      //console.log(author)
      const newBook = new Book({ ...args, author: author._id })

      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT', // equivalente a UserInputError
            invalidArgs: args
          }
        })
      }
      return newBook.populate('author')
    },

    editAuthor: async (root, args, context) => {

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const authorToChange = await Author.findOne({ name: args.name });
      if (!authorToChange) {
        return null
      }

      // Actualizamos el campo born
      authorToChange.born = args.setBornTo;

      try {
        await authorToChange.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT', // equivalente a UserInputError
            invalidArgs: args
          }
        })
      }
      return authorToChange
    },
    
    createUser: async (root,args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      
      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT', // equivalente a UserInputError
            invalidArgs: args
          }
        })
      }
      return user
    },

    login: async (root,args) => {
      const user = await User.findOne({ username: args.username })
      //console.log(user)
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT', // equivalente a UserInputError
            invalidArgs: args
          }
        })        
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})