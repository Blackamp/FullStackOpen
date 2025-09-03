import { useState } from 'react'
import { CREATE_BOOK, ALL_AUTHORS, ALL_GENRES } from '../queries'
import { useMutation, useApolloClient } from '@apollo/client'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const client = useApolloClient()


  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_AUTHORS },{ query: ALL_GENRES }],
    onError: (error) => {
      console.log("ERROR createBook")
      console.log(error)
      const message =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.result?.errors?.[0]?.message ||
        error.message;
      console.log("Error message:", message);
      props.setError(message)
    },
    update: (cache, response) => {
      const addedBook = response.data.addBook
      props.updateCacheBooksWith(addedBook)
    /*
      // Actualizamos caché de ALL_BOOKS sin variables (todos)
      cache.updateQuery({ query: ALL_BOOKS, variables: { genre: null } }, (data) => {
        if (!data) return { allBooks: [addedBook] }
        return { allBooks: data.allBooks.concat(addedBook) }
      })

      // También actualizamos caché para cada género que tenga el libro
      addedBook.genres.forEach(g => {
        try {
          cache.updateQuery({ query: ALL_BOOKS, variables: { genre: g } }, (data) => {
            if (!data) throw new Error("Cache empty") // fuerza el refetch
            return { allBooks: data.allBooks.concat(addedBook) }
          })
        } catch (e) {
          // Si la query no estaba en caché, la refetcheamos
          client.refetchQueries({
            include: [ { query: ALL_BOOKS, variables: { genre: g } } ]
          })
        }
      })*/
    }
  })


  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    createBook({variables: {title,published: parseInt(published),author,genres}})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook