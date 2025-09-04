import express from 'express';
import { parseArgumentsBmi , calculateBmi} from "./bmiCalculator";


//const express = require('express');

const app = express();

app.get('/hello', (_req, res) => {
  res.send(`Hello Full Stack!`);
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  try{
    parseArgumentsBmi([ '', '', height as string, weight as string]);
    const bmi = calculateBmi(Number(height), Number(weight));
    res.send({
      weight,
      height,
      bmi
    });
    } catch (error: unknown){  
        let errorMessage = 'Something bad happened.'
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;   
        }
        res.status(400).send({ error: errorMessage });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});