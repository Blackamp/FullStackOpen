import express from 'express';
import patientsService from '../services/patientsService';
import {toNewPatientEntry, toNewEntry} from '../utils';




const patientsController = express.Router();

patientsController.get('/', (_req, res) => {
  //res.send('Fetching all patients!');
  res.send(patientsService.getNonSensitiveEntries());
});

patientsController.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

patientsController.post('/', (req, res) => {
  //res.send('Saving a patient!');
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedPatientEntry = patientsService.addPatient(newPatientEntry);
    console.log("ADD PATIENT - ",addedPatientEntry);
    res.json(addedPatientEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
      console.log(errorMessage);

    }
    res.status(400).send(errorMessage);
  }
});

patientsController.post('/:id/entries', (req, res) => {
  //res.send('Saving a patient!');
  try {
    const patientId = req.params.id;
    const newEntry = toNewEntry(req.body);

    const addEntry = patientsService.addEntry(patientId,newEntry);
    console.log("ADD ENTRY PATIENT - ",addEntry);
    res.json(addEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
      console.log(errorMessage);

    }
    res.status(400).send(errorMessage);
  }
});



export default patientsController;