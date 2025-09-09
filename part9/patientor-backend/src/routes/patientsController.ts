import express from 'express';
import patientsService from '../services/patientsService';


const patientsController = express.Router();

patientsController.get('/', (_req, res) => {
  //res.send('Fetching all patients!');
  res.send(patientsService.getNonSensitiveEntries());
});

patientsController.post('/', (_req, res) => {
  res.send('Saving a patient!');
});

export default patientsController;