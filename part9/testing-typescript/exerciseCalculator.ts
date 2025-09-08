import { isNotNumber } from "./utils";


interface MultiplyValues {
  targetObj: number;
  trainingArray: number[];
}

const parse4ArgumentsExer = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const targetObj = args[2];
  const trainingArray = [];

  if(isNotNumber(targetObj))
    throw new Error('Target value is not a number');

  for (let i = 3; i < args.length; i++) {
    if(isNotNumber(args[i]))
        throw new Error('One of the exercise values is not a number');
    else
        trainingArray.push(Number(args[i]));
  }

  return {
    targetObj: Number(targetObj),
    trainingArray
  };
};


export const parseObjArgumentsExer = (args: unknown): MultiplyValues => {

   if (!args || typeof args !== 'object' || !('daily_exercises' in args) || !('target' in args)) {
    throw new Error('Invalid arguments');
  }

  const targetObj = args.target;
  const trainingArray = [];

  if(isNotNumber(targetObj))
    throw new Error('Target value is not a number');


   if (!Array.isArray(args.daily_exercises)) {
    throw new Error('daily_exercises must be an array');
  }

  for (let i = 0; i < args.daily_exercises.length; i++) {
    if(isNotNumber(args.daily_exercises[i]))
        throw new Error('One of the exercise values is not a number');
    else
        trainingArray.push(Number(args.daily_exercises[i]));
  }

  return {
    trainingArray,
    targetObj: Number(targetObj)
  };
};




interface Ejercicio {
    numDays: number;
    trainingDays: number;
    targetTimeObj: number;
    averageTime: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
}

export const calculateExercises = (userTargetObj:number, trainingArray: number[]): Ejercicio => {

    const numDays = trainingArray.length;
    const trainingDays = trainingArray.filter(day => day > 0).length;
    const targetTimeObj = userTargetObj;
    const averageTime = trainingArray.reduce((a, b) => a + b, 0) / numDays;
    const success = averageTime >= targetTimeObj;
    let rating: number;
    let ratingDescription: string;
    if (averageTime >= targetTimeObj) {
        rating = 3;
        ratingDescription = 'Great job, you met your target!';
    } else if (averageTime >= targetTimeObj * 0.55) {
        rating = 2;
        ratingDescription = 'Not too bad but could be better';
    }
    else {
        rating = 1;
        ratingDescription = 'You need to work harder';
    }   

    return {
        numDays,
        trainingDays,
        targetTimeObj,
        averageTime,
        success,
        rating,
        ratingDescription
    };
};

try {
  const { targetObj, trainingArray } = parse4ArgumentsExer(process.argv);
  console.log(calculateExercises(targetObj, trainingArray));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
