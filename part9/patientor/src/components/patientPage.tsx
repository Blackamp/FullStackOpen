import { useEffect, useState } from "react";
import patientService from "../services/patients";
import { useMatch } from "react-router-dom";
import { Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

const PatientPage = () => {


   const [patientSelected, setPatientSelected] = useState<Patient | null>(null);
   
   const match = useMatch('/patients/:id');
   const patID = match ? match.params.id : null;

    useEffect(() => {
      if (!patID) return;

      const fetchPatient = async () => {
        try {
          const patient = await patientService.getPatient(patID);
          setPatientSelected(patient); // actualiza el estado
        } catch (error) {
          console.error(error);
        }
      };

      void fetchPatient();
    }, [patID]);


  if (!patID) return <div>Invalid patient ID</div>;
  if (!patientSelected) return <div>Patient not found</div>;

  return (
    <div>
      <p>Patient information:</p>
      <h2>{patientSelected.name} {patientSelected.gender === "male" ? <MaleIcon /> : patientSelected.gender === "female" ? <FemaleIcon /> : null}</h2>
      <ul>
        <li>Date of Birth: {patientSelected.dateOfBirth}</li>
        <li>SSN: {patientSelected.ssn}</li> 
        <li>Occupation: {patientSelected.occupation}</li>
        <li>id: {patientSelected.id}</li>
      </ul>
    </div>
  );
};

export default PatientPage;

