import { Entry, Diagnose} from "../types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

const getHealthIcon = (rating: number) => {
  switch (rating) {
    case 0:
      return <FavoriteIcon style={{ color: "green" }} />;
    case 1:
      return <FavoriteIcon style={{ color: "yellow" }} />;
    case 2:
      return <FavoriteIcon style={{ color: "orange" }} />;
    case 3:
      return <FavoriteIcon style={{ color: "red" }} />;
  }
};

const entryStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9"
  };

// Helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnose[];
}



const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {

  switch (entry.type) {
      case "Hospital":
        return (
          <div key={entry.id} style={entryStyle}>
              <p>{entry.date} / <MonitorHeartIcon/> {entry.type}</p>
              <p>{entry.description}</p>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
              <ul>
                  {entry.diagnosisCodes.map(code => {
                    const descriptionCode = diagnoses.find(d => d.code === code)?.name || "Unknown diagnosis";
                    return (<li key={code}>{code} - {descriptionCode}</li>);
                  })}
              </ul>
              ) : (
              <p>No diagnosis codes</p>
              )}
              {entry.discharge ? (
                <div>
                    <p>Discharge date: {entry.discharge.date}</p>
                    <p>Criteria: {entry.discharge.criteria}</p>
                </div>
              ) : null}
              <p>Diagnosed by: {entry.specialist}</p>
          </div>
        );


      case "OccupationalHealthCare":
        return (
          <div key={entry.id} style={entryStyle}>
              <p>{entry.date} / <VaccinesIcon/> {entry.type}</p>
              <p>{entry.employerName}</p>
              <p>{entry.description}</p>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
              <ul>
                  {entry.diagnosisCodes.map(code => {
                    const descriptionCode = diagnoses.find(d => d.code === code)?.name || "Unknown diagnosis";
                    return (<li key={code}>{code} - {descriptionCode}</li>);
                  })}
              </ul>
              ) : (
              <p>No diagnosis codes</p>
              )}
              {entry.sickLeave ? (
                <p>Sick Leave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</p>
              ) : null}
              <p>Diagnosed by: {entry.specialist}</p>
          </div>
        );


      case "HealthCheck":
        return (
          <div key={entry.id} style={entryStyle}>
              <p> {entry.date} / <MedicalInformationIcon/> {entry.type}</p>
              <p>{entry.description}</p>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
              <ul>
                  {entry.diagnosisCodes.map(code => {
                    const descriptionCode = diagnoses.find(d => d.code === code)?.name || "Unknown diagnosis";
                    return (<li key={code}>{code} - {descriptionCode}</li>);
                  })}
              </ul>
              ) : (
              <p>No diagnosis codes</p>
              )}
              <p>Health Rating: {entry.healthCheckRating} {getHealthIcon(entry.healthCheckRating)} </p>
              <p>Diagnosed by: {entry.specialist}</p>
          </div>
        );
        default:
            return assertNever(entry);
    }
};

export default EntryDetails;

  