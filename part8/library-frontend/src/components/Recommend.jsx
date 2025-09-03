import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME,  } from '../queries'


const Recommend = (props) => {

  const resultUser = useQuery(ME)

  const user = resultUser.data?.me

  const resultBooks = useQuery(ALL_BOOKS, {
    variables: { genre: user?.favoriteGenre },
    skip: !user
  })
  
  if (!props.show) return null
  if (resultUser.loading) return <div>Loading...</div>;
  if (resultUser.error) return <div>Error loading user: {resultUser.error.message}</div>;

  if (resultBooks.loading) return <div>Loading...</div>;
  if (resultBooks.error) return <div>Error loading books: {resultBooks.error.message}</div>;

  const filteredBooks = resultBooks.data.allBooks

  //console.log(books)
  //console.log(user)

  return (
    <div>
      <h2>Recommendations</h2>
      <p>books in your favourite genre <b>{user.favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
