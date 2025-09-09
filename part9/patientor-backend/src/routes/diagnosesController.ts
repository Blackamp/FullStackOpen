import express from 'express';
import diagnosesService from '../services/diagnosesService';


const diagnoseController = express.Router();

diagnoseController.get('/', (_req, res) => {
  //console.log(diagnosesService.getEntries());
  //res.send('Fetching all diagnoses!');
  res.send(diagnosesService.getEntries());
});

diagnoseController.post('/', (_req, res) => {
  res.send('Saving a diagnose!');
});

export default diagnoseController;