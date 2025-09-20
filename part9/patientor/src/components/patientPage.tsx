import { useEffect, useState } from "react";
import patientService from "../services/patients";
import diagnoseService from "../services/diagnoses";
import EntryDetails from "./EntryDetails";
import { useMatch } from "react-router-dom";
import { Patient, Diagnose } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import AddEntryForm from "./AddEntryForm";
import { Button } from '@mui/material';


const PatientPage = () => {

  const [patientSelected, setPatientSelected] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [showForm, setShowForm] = useState(false);

  const match = useMatch('/patients/:id');
  const patID = match ? match.params.id : null;

  // Obtenemos el paciente seleccionado
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

  // Obtenemos todos los diagnósticos
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await diagnoseService.getDiagnoses();
        setDiagnoses(data);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };

    void fetchDiagnoses();
  }, []);


  if (!patID) return <div>Invalid patient ID</div>;
  if (!patientSelected) return <div>Patient not found</div>;

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

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



      {showForm && <AddEntryForm patID={patID} setPatient={setPatientSelected} diagnoses={diagnoses}/>}

      <Button variant="contained" color="primary" onClick={handleToggleForm}>
        {showForm ? "Cancel" : "Add Entry"}
      </Button>

      <h3>Entries</h3>
      {patientSelected.entries.length === 0 ? (
        <p>No entries available.</p>
      ) : (
        patientSelected.entries.map(entry =>
           <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        )
      )}
    </div>
  ); 

};

export default PatientPage;