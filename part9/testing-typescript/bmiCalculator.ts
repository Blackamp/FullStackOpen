import { isNotNumber } from "./utils";


interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}


const calculateBmi  = (alturaCM: number, pesoKg: number): string => {
    const alturaM = alturaCM / 100;
    const IMC = pesoKg / (alturaM * alturaM);

    if (IMC < 18.5) {
        return 'Underweight';
    } else if (IMC >= 18.5 && IMC < 24.9) {
        return 'Normal weight';
    } else if (IMC >= 25 && IMC < 29.9) {
        return 'Overweight';
    } else if (IMC >= 30) {
        return 'Obesity';
    } else {
        return 'Error';
    }
}

try {
  const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}


