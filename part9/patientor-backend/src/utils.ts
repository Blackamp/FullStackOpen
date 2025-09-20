import { NewPatient, Gender, Entry, NewEntry, HealthCheckRating } from './types';



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

const isHealthCheckRating = (param: unknown): param is HealthCheckRating => {
  return typeof param === 'number' && Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (hcr: unknown): HealthCheckRating => {
  if (isHealthCheckRating(hcr)) {
    return hcr; // Si es un número válido, lo devolvemos
  }
  
  // Si no es un número, intentamos ver si es una clave de texto válida
  if (typeof hcr === 'string' && Object.keys(HealthCheckRating).includes(hcr)) {
    return HealthCheckRating[hcr as keyof typeof HealthCheckRating]; // Convertimos la clave de texto a su valor numérico
  }

  throw new Error('Incorrect HealthCheckRating: ' + hcr);
};


const parseEntries = (entries: unknown): Entry[] => {
  //Comprobamos si es un array
  if (!Array.isArray(entries)) {
    throw new Error('Incorrect entries: is not array -' + JSON.stringify(entries));
  }

  entries.forEach(entry => {

    // aseguramos que es un objeto no nulo
    if (!entry || typeof entry !== 'object') {
      throw new Error('Incorrect some entry: not an object-'+ JSON.stringify(entry));
    }

    // comprobamos que existe "type"
    if (!('type' in entry) ) {
      throw new Error('Incorrect some entry: missing type -' + JSON.stringify(entry));
    }

    const typeEntr = parseString(entry.type, "type");

    // comprobamos que "type" es uno de los tipos permitidos
    if (!['Hospital', 'OccupationalHealthCare', 'HealthCheck'].includes(typeEntr)) {
      throw new Error('Incorrect entry type: ' + typeEntr);
    }
  });

  return entries as Entry[];
};

export const toNewEntry = (object: unknown): NewEntry => {
  console.log(JSON.stringify(object))
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if (!('type' in object) ) {
    throw new Error('Incorrect some entry: missing type -' + JSON.stringify(object));
  }
  const typeEntr = parseString(object.type, "type");

  let newEntry: NewEntry

  // Lógica para manejar diagnosisCodes de forma genérica
  const diagnosisCodes: string[] = [];
  if ('diagnosisCodes' in object && Array.isArray(object.diagnosisCodes)) {
      object.diagnosisCodes.forEach(code => {
          diagnosisCodes.push(parseString(code, "Code diagnose"));
      });
  }

  switch (typeEntr) {
    case "Hospital":
      // 1. Comprueba que las propiedades principales existen y son del tipo adecuado.
      if (!('description' in object && 'date' in object && 'specialist' in object && 'discharge' in object)) {
          throw new Error('Incorrect data in Hospital Entry: some main fields are missing');
      }

      // 2. Asegura que el 'discharge' existe y es un objeto válido.
      if (typeof object.discharge !== 'object' || object.discharge === null) {
          throw new Error('Incorrect discharge data: it must be a valid object');
      }

      // 3. Comprueba que las propiedades anidadas 'date' y 'criteria' existen en 'discharge'.
      if (!('date' in object.discharge && 'criteria' in object.discharge)) {
          throw new Error('Incorrect discharge data: date or criteria is missing');
      }

    newEntry = {
        description: parseString(object.description, "description"),
        date: parseDate(object.date),
        specialist: parseString(object.specialist, "specialist"),
        type: "Hospital",
        diagnosisCodes: diagnosisCodes,
        discharge: {
            date: parseDate(object.discharge.date),
            criteria: parseString(object.discharge.criteria, "criteria")
        }
    };
    
    return newEntry;   


    case "OccupationalHealthCare":
      if('description' in object && 'date' in object && 'specialist' in object && 'employerName' in object){
        newEntry = {
          description: parseString(object.description, "description"),
          date: parseDate(object.date),
          specialist: parseString(object.specialist, "specialist"),
          type:"OccupationalHealthCare",
          diagnosisCodes: diagnosisCodes,
          employerName: parseString(object.employerName, "employerName")
        }
      }else{
          throw new Error('Incorrect data in OccupationalHealthCare Entry: some fields are missing');
      }

       if ('sickLeave' in object && typeof object.sickLeave === 'object' && object.sickLeave) {
        if ('startDate' in object.sickLeave && 'endDate' in object.sickLeave) {
            newEntry.sickLeave = {
                startDate: parseDate(object.sickLeave.startDate),
                endDate: parseDate(object.sickLeave.endDate)
            };
        } else {
            throw new Error('Incorrect data in sickLeave: startDate or endDate is missing');
        }
      }
      return newEntry;   
    
    case "HealthCheck":
      if('description' in object && 'date' in object && 'specialist' in object && 'healthCheckRating' in object){
        newEntry = {
          description: parseString(object.description, "description"),
          date: parseDate(object.date),
          specialist: parseString(object.specialist, "specialist"),
          type:"HealthCheck",
          diagnosisCodes: diagnosisCodes,
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
        }
      }else{
          throw new Error('Incorrect data in HealthCheck Entry: some fields are missing');
      }

      return newEntry;   

    default:
      throw new Error('Incorrect entry type: ' + typeEntr);
  }


};



export const toNewPatientEntry = (object: unknown): NewPatient => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  console.log(object)

  if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object /*&& 'entries' in object*/) {
    const newEntry: NewPatient = {
      name: parseString(object.name,"name"),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation,"occupation"),
      entries: Array.isArray((object as any).entries) 
        ? parseEntries((object as any).entries) 
        : []  // si no existe, inicializa vacío
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