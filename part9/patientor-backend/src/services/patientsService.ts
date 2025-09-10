import patientsData from '../../data/patients';
import { PatientEntry, NewPatientEntry, NonSensitivePatientEntry } from '../../data/types';
import { v1 as uuid } from 'uuid';



const patients: PatientEntry[] = patientsData;


const getEntries = ():PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): PatientEntry | undefined => {
  console.log("FIND BY ID - ",id);
  const entry = patients.find(p => p.id === id);
  return entry;
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addPatient
};