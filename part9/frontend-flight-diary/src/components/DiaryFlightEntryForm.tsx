import { useState } from 'react'
import type { NewDFLEntry, DiaryFlightEntry} from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { createDiaryFlight } from '../services/dFLEntryService.ts'
import { AxiosError } from 'axios';



const EntryDiaryFlightForm = () =>{

  const [newDateDFl, setNewDateDFl] = useState('')
  const [newVisibilityDFL, setNewVisibilityDFL] = useState('')
  const [newWeatherDFL, setNewWeatherDFL] = useState('')
  const [newCommentDFL, setNewCommentDFL] = useState('')

  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newEntryDFLMutation = useMutation<DiaryFlightEntry, AxiosError<{ error: string }>, NewDFLEntry>({
    mutationFn: createDiaryFlight, 
    onSuccess: (newEDFL) => {
      const allDiariesFl = queryClient.getQueryData<DiaryFlightEntry[]>(['DiariesFlight']) ?? [];
      queryClient.setQueryData(['DiariesFlight'], allDiariesFl.concat(newEDFL))
      notificationDispatch({ type: 'message', payload: `a new diary flight entry '${newEDFL.date}' created` });
      setTimeout(() => {
        notificationDispatch({ type: 'deleteNotification' });
      }, 5000);
    },
    onError: (error) => {
      console.log(error);
      notificationDispatch({ type: 'message', payload: `Err: '${error.response?.data ?? error.message}'` });
      setTimeout(() => {
        notificationDispatch({ type: 'deleteNotification' });
      }, 5000);
    },
  });
  
  const addDiaryFlEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
    const newDiaryFL: NewDFLEntry = {
      date: newDateDFl,
      visibility: newVisibilityDFL,
      weather: newWeatherDFL,
      comment: newCommentDFL
    }
    console.log(newDiaryFL)

    newEntryDFLMutation.mutate(newDiaryFL)

    setNewDateDFl('')
    setNewVisibilityDFL('')
    setNewWeatherDFL('')
    setNewCommentDFL('')


    //dispatch(createAnecdote(content))
    //dispatch(setNotification(`A new anecdoted created '${content}'`,5)) 
  }

  return (
      <div>
        <form onSubmit={addDiaryFlEntry}>
          <div>
            Date:{' '}
            <input type="date" id="inputDate" value={newDateDFl} onChange={(event) => setNewDateDFl(event.target.value)}/>
          </div>
          <div>
            Visibility:{' '}
             <input type="radio" name="visibility" onChange={() => setNewVisibilityDFL('great')} /> great    
             <input type="radio" name="visibility" onChange={() => setNewVisibilityDFL('good')} /> good    
             <input type="radio" name="visibility" onChange={() => setNewVisibilityDFL('ok')} /> ok    
             <input type="radio" name="visibility" onChange={() => setNewVisibilityDFL('poor')} /> poor   
          </div>
          <div>
            Weather:{' '}
            <input type="radio" name="weather" onChange={() => setNewWeatherDFL('sunny')} /> sunny
            <input type="radio" name="weather" onChange={() => setNewWeatherDFL('rainy')} /> rainy    
            <input type="radio" name="weather" onChange={() => setNewWeatherDFL('cloudy')} /> cloudy
            <input type="radio" name="weather" onChange={() => setNewWeatherDFL('stormy')} /> stormy    
            <input type="radio" name="weather" onChange={() => setNewWeatherDFL('windy')} /> windy    
          </div>
          <div>
            Comment:{' '}
            <input id="inputComment" value={newCommentDFL} onChange={(event) => setNewCommentDFL(event.target.value)}/>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    )
}

export default EntryDiaryFlightForm