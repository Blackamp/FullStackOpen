import { useState } from 'react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'
import Select from 'react-select';



const AuthorForm = (props) => {
  const [year, setYear] = useState('')
  const [selectedOption, setSelectedOption] = useState(null);


  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      console.log("ERROR editAuthor")
      console.log(error)
      const message =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.result?.errors?.[0]?.message ||
        error.message;
      console.log("Error message:", message);
      props.setError(message)
    }
  })

  const options = []
  props.authors.map ((a) => {
    options.push({value: a.name, label: a.name})
  })
  console.log(options)
  

  const submit = async (event) => {
    event.preventDefault()

    console.log('Change Author...')
    editAuthor({ variables: { name: selectedOption.value, born: parseInt(year) } })
    setYear('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
        </div>
        <div>
          born
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default AuthorForm