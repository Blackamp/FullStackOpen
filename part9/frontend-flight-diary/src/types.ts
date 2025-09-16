export interface DiaryFlightEntry {
  id: number,
  date: string,
  visibility: string,
  weather: string,
  comment: string
}


export type NewDFLEntry = Omit<DiaryFlightEntry, 'id'>


