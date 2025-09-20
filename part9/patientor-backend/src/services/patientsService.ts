import patientsData from '../../data/patients';
import { Patient, NewPatient, NonSensitivePatient, NewEntry} from '../types';
import { v1 as uuid } from 'uuid';



const patients: Patient[] = patientsData;


const getEntries = ():Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  console.log("FIND BY ID - ",id);
  const entry = patients.find(p => p.id === id);
  return entry;
};

const addPatient = ( entry: NewPatient ): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, addEntry: NewEntry): Patient => {

  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const newEntry = {
    id: uuid(),
    ...addEntry
  };

  patient.entries.push(newEntry);

  return patient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addPatient,
  addEntry
};