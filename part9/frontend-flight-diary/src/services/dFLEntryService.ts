import axios from 'axios';
import type { DiaryFlightEntry, NewDFLEntry } from "../types";

const baseUrl = 'http://localhost:3000/api/diaries'

export const getAllDiariesFlight= async () => {
  const response = await axios
    .get<DiaryFlightEntry[]>(baseUrl);
  return response.data;
}

export const createDiaryFlight = async (object: NewDFLEntry) => {
  const response = await axios
    .post<DiaryFlightEntry>(baseUrl, object);
  return response.data;
}

