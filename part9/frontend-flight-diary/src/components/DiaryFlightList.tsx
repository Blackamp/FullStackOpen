import { getAllDiariesFlight } from '../services/dFLEntryService.ts'
import { useQuery } from '@tanstack/react-query'
import type { DiaryFlightEntry } from '../types';

const DiaryFlightList = () =>{

  //Obtención de los diarios de vuelo del servidor mediante React Query
  const result = useQuery<DiaryFlightEntry[],Error>({
    queryKey: ['DiariesFlight'],
    queryFn: getAllDiariesFlight,
    refetchOnWindowFocus: false,
    retry:1,
    initialData: []
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading ) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return (
      <div>
        <span>Anecdote service not available due to problems in server</span>
        <br/>
        <span>Error: {result.error.message}</span>
      </div>
    )
    }

  const diariesFlight = result.data;

  if (diariesFlight.length === 0) {
    return <div>No flight diaries available</div>;
  }

  return (
      <div>
        {diariesFlight?.map(entry =>

          <div key={entry.id}>
            <h4>{entry.date}</h4>
            <ul>
              <li>Visibility: {entry.visibility}</li>
              <li>Weather: {entry.weather}</li>
              <li>Comment: {entry.comment}</li>  
            </ul>
            <br></br>
          </div>
        )}      
      </div>
    )
}

export default DiaryFlightList