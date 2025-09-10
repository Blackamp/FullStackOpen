import { NewPatientEntry, Gender } from '../data/types';



const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (text: unknown, agrs: string): string => {

    if(!isString(text)) {
        throw new Error(`Incorrect or missing ${agrs}`);
    }
    return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
      throw new Error('Incorrect date: ' + date);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect gender: ' + gender);
  }
  return gender;
};


export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object)  {
    const newEntry: NewPatientEntry = {
      name: parseString(object.name,"name"),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation,"occupation")
    };

    // ssn opcional
    if ('ssn' in object && object.ssn !== undefined) {
      newEntry.ssn = parseString(object.ssn, "ssn");
    }

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;