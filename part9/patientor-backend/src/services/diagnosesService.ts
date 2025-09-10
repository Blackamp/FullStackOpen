import diagnosesData from '../../data/diagnoses';
import { DiagnoseEntry } from '../../data/types';


const diagnoses: DiagnoseEntry[] = diagnosesData;


const getEntries = ():DiagnoseEntry[] => {
  return diagnoses;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};