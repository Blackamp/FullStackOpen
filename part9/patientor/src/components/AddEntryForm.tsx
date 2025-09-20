import { useState } from "react";
import {  TextField, InputLabel, MenuItem, Select, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { NewEntry, Patient, Diagnose } from "../types";
import patientService from "../services/patients";
import axios from 'axios';

interface Props {
  patID: string
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  diagnoses: Diagnose[]
}

const AddEntryForm = ({patID, setPatient,diagnoses} : Props) => {
  const [type, setType] = useState('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthRate, setHealthRate] = useState("0");
  const [diagnosesCodes, setDiagnosesCodes] = useState<string[]>([]);
  const [employerName, setEmployerName] = useState('');
  const [startDateSL, setStartDateSL] = useState('');
  const [endDateSL, setEndDateSL] = useState('');
  const [dateD, setDateD] = useState('');
  const [criteriaD, setCriteriaD] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updateEntryPatient = async(patID: string, newEntry: NewEntry) => {
    try {
      const updatedPatient  = await patientService.addEntry(patID, newEntry);
      setPatient(updatedPatient);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
          setTimeout(() => { setError('');}, 7000);
        } else {
          setError("Unrecognized axios error");
          setTimeout(() => { setError('');}, 7000);
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
        setTimeout(() => { setError('');}, 7000);
      }
    }
  };

  const handleAddPatient = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    let newEntry : NewEntry; 

    switch(type){
      case "HealthCheck":
        newEntry={
          type: "HealthCheck",
          description: description,
          date: date,
          specialist: specialist,
          diagnosisCodes: diagnosesCodes,
          healthCheckRating: Number(healthRate)
        };

        updateEntryPatient(patID, newEntry);
        break;

      case "OccupationalHealthCare":
        newEntry={
          type: "OccupationalHealthCare",
          description: description,
          date: date,
          specialist: specialist,
          diagnosisCodes: diagnosesCodes,
          employerName: employerName,
        };

        if (startDateSL || endDateSL) {
          newEntry.sickLeave = {
            startDate: startDateSL || "",
            endDate: endDateSL || ""
          };
        }

        updateEntryPatient(patID, newEntry);
        break;

      case "Hospital":
        newEntry={
          type: "Hospital",
          description: description,
          date: date,
          specialist: specialist,
          diagnosisCodes: diagnosesCodes,
          discharge: {
            date: dateD,
            criteria: criteriaD
          }
        };
        updateEntryPatient(patID, newEntry);
        break;
    }



  };


  return (
    <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", margin: "20px auto", display: "flex", flexDirection: "column", gap: "15px" }}>
      <h3>Add new entry</h3>
      {error && (
        <div style={{ backgroundColor: "#fdecea", color: "#d32f2f", border: "1px solid #f5c2c7", borderRadius: "6px", padding: "10px 15px", marginTop: "15px", fontSize: "14px" }}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}
      <form onSubmit={handleAddPatient} >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InputLabel>Tipo de entrada:</InputLabel>
          <Select label="Type" fullWidth size="small" value={type} onChange={({ target }) => setType(target.value)}>
            <MenuItem key="HealthCheck" value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem key="OccupationalHealthCare" value="OccupationalHealthCare">OccupationalHealthCare</MenuItem>
            <MenuItem key="Hospital" value="Hospital">Hospital</MenuItem>
          </Select>

          <InputLabel style={{ marginTop: 10 }}>Description</InputLabel>
          <TextField fullWidth size="small"  value={description} onChange={({ target }) => setDescription(target.value)}/>
          <InputLabel style={{ marginTop: 10 }}>Date</InputLabel>
          <DatePicker value={date ? dayjs(date) : null} onChange={(newValue: Dayjs | null) => setDate(newValue ? newValue.format("YYYY-MM-DD") : "")} slotProps={{ textField: { size: "small"} }} />
          <InputLabel style={{ marginTop: 10 }}>Specialist</InputLabel>
          <TextField fullWidth size="small"  value={specialist} onChange={({ target }) => setSpecialist(target.value)}/>
          <InputLabel style={{ marginTop: 10 }}>Diagnoses Codes</InputLabel>
          <Select fullWidth size="small" multiple value={diagnosesCodes} onChange={(event) => setDiagnosesCodes(event.target.value as string[])}>
              {diagnoses.map(diag =>
                <MenuItem key={diag.code} value={diag.code}>{diag.code}</MenuItem>
              )}
          </Select>

          {type === "HealthCheck" ? (
            <>
              <InputLabel style={{ marginTop: 10 }}>Health Check Rating </InputLabel>
              <Select fullWidth size="small" value={healthRate} onChange={({ target }) => setHealthRate(target.value)}>
                <MenuItem key="Healthy" value='0'>Healthy</MenuItem>
                <MenuItem key="LowRisk" value='1'>LowRisk</MenuItem>
                <MenuItem key="HighRisk" value='2'>HighRisk</MenuItem>
                <MenuItem key="CriticalRisk" value='3'>CriticalRisk</MenuItem>
              </Select>
            </>
          ) : (
            <></>
          )}

          {type === "OccupationalHealthCare" ? (
            <>
              <InputLabel style={{ marginTop: 10 }}>Employer Name</InputLabel>
              <TextField fullWidth size="small" value={employerName} onChange={({ target }) => setEmployerName(target.value)}/>
              <InputLabel style={{ marginTop: 10 }}>SickLeave startDate</InputLabel>
              <DatePicker value={startDateSL ? dayjs(startDateSL) : null} onChange={(newValue: Dayjs  | null)  => setStartDateSL(newValue ? newValue.format("YYYY-MM-DD") : "")}  slotProps={{ textField: { size: "small"} }} />
              <InputLabel style={{ marginTop: 10 }}>SickLeave endDate</InputLabel>
              <DatePicker value={endDateSL ? dayjs(endDateSL) : null} onChange={(newValue: Dayjs  | null)  => setEndDateSL(newValue ? newValue.format("YYYY-MM-DD") : "")} slotProps={{ textField: { size: "small"} }} /> 
            </>
          ) : (
            <></>
          )}

          {type === "Hospital" ? (
            <>
              <InputLabel style={{ marginTop: 10 }}>Discharge date</InputLabel>
              <DatePicker value={dateD ? dayjs(dateD) : null}onChange={(newValue: Dayjs | null)  => setDateD(newValue ? newValue.format("YYYY-MM-DD") : "")} slotProps={{ textField: { size: "small"} }} />
              <InputLabel style={{ marginTop: 10 }}>Discharge criteria</InputLabel>
              <TextField fullWidth size="small" value={criteriaD} onChange={({ target }) => setCriteriaD(target.value)}/>
            </>
          ) : (
            <></>
          )}
          <div style={{ marginTop: 20, marginBottom: 5, display: "flex", gap: 10 }}>
            <Button type="submit" variant="contained" color="primary"> Save </Button>
          </div>
       </LocalizationProvider>
     </form>
    </div>
  );
};

export default AddEntryForm;