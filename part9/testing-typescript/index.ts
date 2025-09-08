import express from 'express';
import { parse2ArgumentsBmi , calculateBmi} from "./bmiCalculator";
import { parseObjArgumentsExer , calculateExercises} from "./exerciseCalculator";



//const express = require('express');

const app = express();
app.use(express.json());


app.get('/hello', (_req, res) => {
  res.send(`Hello Full Stack!`);
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  try{
    parse2ArgumentsBmi([height as string, weight as string]);
    const bmi = calculateBmi(Number(height), Number(weight));
    res.send({
      weight,
      height,
      bmi
    });
    } catch (error: unknown){  
        let errorMessage = 'Something bad happened.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;   
        }
        res.status(400).send({ error: errorMessage });
  }
});


app.post('/exercises', (req, res) => {
  const args  = req.body;
  try{
    const dataExer = parseObjArgumentsExer(args);
    const myResult = calculateExercises(dataExer.targetObj, dataExer.trainingArray);
    res.send(myResult);
    } catch (error: unknown){  
        let errorMessage = 'Something bad happened.';
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