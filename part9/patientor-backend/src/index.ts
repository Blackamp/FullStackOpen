import express, { Request, Response, RequestHandler } from 'express';
import cors from "cors";
import diagnosesController from './routes/diagnosesController';
import patientsController from './routes/patientsController';

const app = express();
app.use(express.json());

app.use(cors() as RequestHandler); 


const PORT = 3001;

app.get('/api/ping', (_req: Request, res: Response) => {
  console.log('someone pinged here');
  res.send('pong');
});


app.use('/api/diagnoses', diagnosesController);
app.use('/api/patients', patientsController);




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});